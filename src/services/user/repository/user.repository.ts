import { dirname } from "path";
import * as dotenv from "dotenv";
import Record from "neo4j-driver-core/types/record";
import { pick } from "lodash";
import Neode, { Node } from "neode";
import { v1 as uuidv1 } from "uuid";
import { RegisterDto } from "../dtos/register.dto";
import { UserModel } from "../types/models";
import { FollowingDto } from "../dtos/following.dto";
import { MutualFollowingsPayload } from "../dtos/mutual-followings.dto";
import { AccountStatus } from "../enums/account-status.enum";

const userDir = dirname(__dirname);
dotenv.config();

export class UserRepository {
  private instance = new Neode(process.env.USER_DB_URI, process.env.USER_DB_USERNAME, process.env.USER_DB_PASSWORD)
    .withDirectory(userDir + "/models");

  // Authentication
  /**
   * Create new user (and add new account) when register to site
   * @param registerDto
   * @returns newUser
   */
  public async createUserWithAccount(registerDto: RegisterDto): Promise<any> {
    // Pick user data from register data
    const userData: UserModel.User = {
      id: uuidv1(),
      email: registerDto.username,
      followers: 0,
      followings: 0,
      avatar: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg",
      address: "",
      ...pick(registerDto, ["name", "gender", "dateOfBirth"]),
    };
    userData.id = uuidv1();
    // Pick account data from register data
    const userAccount: UserModel.Account = {...pick(registerDto, ["username", "password"]), id: uuidv1(), status: AccountStatus.UNVERIFIED};

    const query = "Create (:User $userData)-[:HAS]->(:Account $userAccount)";
    const result = await this.instance.writeCypher(query, { userData, userAccount });
    // Final result is the result of the first batch
    return userAccount.id;
  }

  /**
   * Find one account by user name if there is no account -> return null;
   * @param username string
   * @returns account record
   */
  public async findAccountByUsername(username: string): Promise<[UserModel.Account, UserModel.User]> {
    const result = await this.instance.cypher("Match (user:User)-[:HAS]->(account:Account {username: $username}) return account, user", { username });
    if (result.records.length === 0) {
      return [null, null];
    }
    // Account is the first record with account properties
    // The name "account" is from query statement
    return [
      result.records[0].get("account").properties,
      result.records[0].get("user").properties,
    ];
  }
  public async findUserById(id: string): Promise<UserModel.User> {
    const result: Node<UserModel.User> = await this.instance.first<UserModel.User>("User", "id", id);
    return result ? result.properties() : null;
  }

  // Follow
  /**
   * Get list of people user has followed (followings);
   * @param userId
   * @returns user[]
   */
  public async getFollowings(userId: string): Promise<UserModel.User[]> {
    const query: string = "MATCH (user:User {id: $userId})-[:FOLLOW]->(following:User) return following";
    const result = await this.instance.cypher(query, { userId });
    if (result.records.length === 0) {
      return [];
    }
    const followings: UserModel.User[] = result.records.map((record: Record) => record.get("following").properties);
    return followings;
  }

  /**
   * Get list of people who are following us (followers);
   * @param userId
   * @returns user[]
   */
  public async getFollowers(userId: string): Promise<UserModel.User[]> {
    const query: string = "MATCH (user:User {id: $userId})<-[:FOLLOW]-(follower:User) return follower";
    const result = await this.instance.cypher(query, { userId });
    if (result.records.length === 0) {
      return [];
    }
    const followers: UserModel.User[] = result.records.map((record: Record) => record.get("follower").properties);
    return followers;
  }

  /**
   * Get list of people who we can follow
   * @param userId
   * @returns user[]
   */
  public async getAvailableUsers(userId: string): Promise<UserModel.User[]> {
    // Get users who are either our following or followers
    // The result will include current user as well so we add the !== userId to filter out the current user
    const query: string =
      ` match (user:User)
        where not user.id = $userId and
        not (user)-[:FOLLOW]->({id: $userId}) and 
        not (user)<-[:FOLLOW]-({id: $userId})
        return user`;
    const result = await this.instance.cypher(query, { userId });
    if (result.records.length === 0) {
      return [];
    }
    const users: UserModel.User[] = result.records.map((record: Record) => record.get("user").properties);
    return users;
  }

  /**
   * Get list of recommended users who we should follow
   * @param userId
   * @returns mutualFollowings[]
   */
  public async getRecommendedFollowings(userId: string): Promise<MutualFollowingsPayload[]> {
    // Get current user followings id list
    const followingId =
      ` match (user:User {name: 'Ros'})-[:FOLLOW]->(following:User)
        return collect(following.id) as followingList`;
    const followingResult = await this.instance.cypher(followingId, {});
    const followingList = followingResult.records[0].get("followingList");
    // Get recommend base on current user's following list
    // First, get related user who also follow current user followings and their followings as well called relatedFollowing
    // Then, count the mutual followings, which are those who's in the current user's followings list
    // Note: Make sure that related user are not in the current user followings list
    const recommendQuery =
      ` match (user:User {name: 'Ros'})-[:FOLLOW]->(following:User)<-[:FOLLOW]-(related:User)
        with distinct related as r
        match (r:User)-[:FOLLOW]->(relatedFollowing:User)
        where not r.id in $followingList and relatedFollowing.id in $followingList
        return distinct r as recommend, count(distinct relatedFollowing) as mutualCount
        order by mutualCount desc limit 5`;
    const recommendResult = await this.instance.cypher(recommendQuery, { followingList });
    const mutualFollowings: MutualFollowingsPayload[] = recommendResult.records.map((record: Record) => (
      {
        user: record.get("recommend").properties,
        mutualFollowings: record.get("mutualCount").low,
      }
    ));

    return mutualFollowings;
  }

  /**
   * Create the following relationship for two users
   * @param followingDto
   * @returns void
   */
  public async addFollowing(followingDto: FollowingDto): Promise<void> {
    const query = "MATCH (user:User {id: $userId}) MATCH (target:User {id: $targetId}) MERGE (user)-[:FOLLOW]->(target) RETURN *";
    await this.instance.writeCypher(query, followingDto);
  }
  /**
   * Delete the follow relationship to the target user (unFollow)
   * @param followingDto
   * @returns boolean
   */
  public async deleteFollowing(followingDto: FollowingDto): Promise<void> {
    const query: string = "MATCH (user:User {id: $userId})-[follow:FOLLOW]->(target:User {id: $targetId}) DELETE follow";
    await this.instance.writeCypher(query, followingDto);
  }

  /**
   * Check if user already follow the target
   * @param followingDto
   * @returns boolean
   */
  public async checkHasFollowed(followingDto: FollowingDto): Promise<boolean> {
    const query: string = "MATCH (user:User {id: $userId})-[follow:FOLLOW]->(target:User {id: $targetId}) return follow";
    const result = await this.instance.cypher(query, followingDto);
    if (result.records.length > 0) {
      return true;
    }
    return false;
  }
}
