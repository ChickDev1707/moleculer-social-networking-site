import { Context, Errors } from "moleculer";
import * as bcrypt from "bcrypt";
import Record from "neode/node_modules/neo4j-driver-core/types/record";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { IApiResponse } from "../../../../configs/api.type";
import { LoginDto } from "../dtos/login.dto";
import { UserRepository } from "../repository/user.repository";
import { RegisterDto } from "../dtos/register.dto";
import { handleError } from "../../../utils/erros.util";
import { UserModel } from "../types/models";
import { FollowingDto } from "../dtos/following.dto";
import { FollowingAction } from "../enums/following-action.enum";
import { MutualFollowingsPayload } from "../dtos/mutual-followings.dto";
dotenv.config();

export class UserAction {
  private userRepo = new UserRepository();
  // User profile
  public getUserInfo = async (ctx: Context<{userId: string}>): Promise<IApiResponse> => {
    try {
      const user: UserModel.User = await this.userRepo.findUserById(ctx.params.userId);
      return {
        code: 200,
        message: "Get user success",
        data: user,
      };
    } catch (error) {
      handleError(error);
    }
  };
  // Auth
  public register = async (ctx: Context<RegisterDto>): Promise<IApiResponse> => {
    try {
      const registerDto: RegisterDto = ctx.params;

      // Validate username
      const [account]: [UserModel.Account, UserModel.User] = await this.userRepo.findAccountByUsername(registerDto.username);
      if (account) {
        throw new Errors.MoleculerClientError("Username already exists", 400);
      }

      // Hash password to store in db
      const SALT = 12;
      const hashedPassword = await bcrypt.hash(registerDto.password, SALT);
      registerDto.password = hashedPassword;

      const newUser: Record = await this.userRepo.createUserWithAccount(registerDto);

      return {
        code: 201,
        message: "Registration success",
        data: newUser,
      };
    } catch (error) {
      handleError(error);
    }
  };
  public login = async (ctx: Context<LoginDto, { accessToken: string }>): Promise<IApiResponse> => {
    try {
      const { username, password } = ctx.params;

      const [account, user]: [UserModel.Account, UserModel.User] = await this.userRepo.findAccountByUsername(username);
      if (!account) {
        throw new Errors.MoleculerClientError("Account does not exist", 404);
      }

      const isValidated = await bcrypt.compare(password, account.password);
      if (!isValidated) {
        throw new Errors.MoleculerClientError("Wrong password!", 401);
      }
      const [accessToken] = this.generateTokens(user.id);

      return {
        code: 200,
        message: "Login success",
        data: { user, accessToken },
      };
    } catch (error) {
      handleError(error);
    }
  };
  // Follow actions
  public editFollowing = async (ctx: Context<FollowingDto>): Promise<IApiResponse> => {
    try {
      const hasFollowed: boolean = await this.userRepo.checkHasFollowed(ctx.params);
      if(ctx.params.actionType === FollowingAction.FOLLOW){
        return this.follow(ctx.params, hasFollowed);
      }else{
        return this.unFollow(ctx.params, hasFollowed);
      }
    } catch (error) {
      handleError(error);
    }
  };
  public follow = async (followingDto: FollowingDto, hasFollowed: boolean): Promise<IApiResponse> => {
    if(hasFollowed){
      throw new Errors.MoleculerClientError("You have already followed this user", 400);
    }
    await this.userRepo.addFollowing(followingDto);
    return {
      code: 200,
      message: "Follow success",
      data: null,
    };
  };

  public unFollow = async (followingDto: FollowingDto, hasFollowed: boolean): Promise<IApiResponse> => {
    if(!hasFollowed){
      throw new Errors.MoleculerClientError("You didn't follow this user", 400);
    }
    await this.userRepo.deleteFollowing(followingDto);
    return {
      code: 200,
      message: "Unfollow success",
      data: null,
    };
  };

  // Read followings/followers
  public getFollowings = async (ctx: Context<{userId: string}>): Promise<IApiResponse> => {
    try {
      const followings: UserModel.User[] = await this.userRepo.getFollowings(ctx.params.userId);
      return {
        code: 200,
        message: "Get followings list success",
        data: followings,
      };
    } catch (error) {
      handleError(error);
    }
  };

  public getFollowers = async (ctx: Context<{userId: string}>): Promise<IApiResponse> => {
    try {
      const followers: UserModel.User[] = await this.userRepo.getFollowers(ctx.params.userId);
      return {
        code: 200,
        message: "Get followers list success",
        data: followers,
      };
    } catch (error) {
      handleError(error);
    }
  };

  public getAvailableUsers = async (ctx: Context<{userId: string}>): Promise<IApiResponse> => {
    try {
      const users: UserModel.User[] = await this.userRepo.getAvailableUsers(ctx.params.userId);
      return {
        code: 200,
        message: "Get available users success",
        data: users,
      };
    } catch (error) {
      handleError(error);
    }
  };

  public getRecommendedFollowings = async (ctx: Context<{userId: string}>): Promise<IApiResponse> => {
    try {
      const users: MutualFollowingsPayload[] = await this.userRepo.getRecommendedFollowings(ctx.params.userId);
      return {
        code: 200,
        message: "Get recommended users success",
        data: users,
      };
    } catch (error) {
      handleError(error);
    }
  };

  private generateTokens = (userId: string): [string, string] => {

    const accessToken: string = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
    const refreshToken: string = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    return [accessToken, refreshToken];
  };

};
