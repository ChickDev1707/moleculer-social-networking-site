import { dirname } from "path";
import * as dotenv from "dotenv";
import Record from "neode/node_modules/neo4j-driver-core/types/record";
import { pick } from "lodash";
import Neode, { Node } from "neode";
import { v1 as uuidv1} from "uuid";
import { RegisterDto } from "../dtos/register.dto";
import { UserModel } from "../types/models";
import { FollowDto } from "../dtos/follow.dto";

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
  public async createUserWithAccount(registerDto: RegisterDto): Promise<Record> {
    // Pick user data from register data
    const userData: any = pick(registerDto, ["name", "gender", "dateOfBirth"]);
    userData.id = uuidv1();
    // Pick account data from register data
    const userAccount: any = pick(registerDto, ["username", "password"]);
    userAccount.id = uuidv1();

    const query = "Create (:User $userData)-[:HAS]->(:Account $userAccount)";
    const result = await this.instance.writeCypher(query, {userData, userAccount});
    // Final result is the result of the first batch
    return result.records.length === 0 ? null : result.records[0];
  }

  /**
   * Find one account by user name if there is no account -> return null;
   * @param username string
   * @returns account record
   */
  public async findAccountByUsername(username: string): Promise<[UserModel.Account, UserModel.User]> {
    const result = await this.instance.cypher("Match (user:User)-[:HAS]->(account:Account {username: $username}) return account, user", { username });
    if(result.records.length === 0){
      return [null, null];
    }
    // Account is the first record with account properties
    // The name "account" is from query statement
    return [
      result.records[0].get("account").properties,
      result.records[0].get("user").properties,
    ];
  }
  public async findUserById(id: string): Promise<UserModel.User>{
    const result: Node<UserModel.User> = await this.instance.first<UserModel.User>("User", "id", id);
    return result? result.properties(): null;
  }

  // Following api
  /**
   * Get list of people user has followed (followings);
   * @param userId
   * @returns user[]
   */
   public async getFollowings(userId: string): Promise<UserModel.User[]> {
    const query: string = "MATCH (user:User {id: $userId})-[follow:FOLLOW]->(following:User) return following";
    const result = await this.instance.cypher(query, {userId});
    if(result.records.length === 0){
      return null;
    }
    const followings: UserModel.User[] = result.records.map((record: Record)=> record.get("following").properties);
    return followings;
  }

  /**
   * Create the following relationship for two users
   * @param followDto
   * @returns void
   */
  public async addFollowing(followDto: FollowDto): Promise<void> {
    const query = "MATCH (user:User {id: $userId}) MATCH (target:User {id: $targetId}) MERGE (user)-[:FOLLOW]->(target) RETURN *";
    await this.instance.writeCypher(query, followDto);
  }

  /**
   * Check if user already follow the target
   * @param followDto
   * @returns boolean
   */
   public async checkHasFollowed(followDto: FollowDto): Promise<boolean> {
    const query: string = "MATCH (user:User {id: $userId})-[follow:FOLLOW]->(target:User {id: $targetId}) return follow";
    const result = await this.instance.cypher(query, followDto);
    if(result.records.length> 0){
      return true;
    }
    return false;
  }
}
