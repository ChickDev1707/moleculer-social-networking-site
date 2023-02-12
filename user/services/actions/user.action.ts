import { Context, Errors } from "moleculer";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { IApiResponse } from "../types/api.type";
import { LoginDto } from "../dtos/login.dto";
import { UserRepository } from "../repository/user.repository";
import { RegisterDto } from "../dtos/register.dto";
import { handleError } from "../utils/error.util";
import { UserModel } from "../types/models";
import { FollowingDto } from "../dtos/following.dto";
import { FollowingAction } from "../enums/following-action.enum";
import { MutualFollowingsPayload } from "../dtos/mutual-followings.dto";
import { TypeNotification } from "../enums/type-notification.enum";
import { SendMailDto } from "../dtos/send-mail.dto";
import { AccountStatus } from "../enums/account-status.enum";
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
  // Search user
  public searchUsers = async (ctx: Context<{input: string}>): Promise<IApiResponse> => {
    try {
      const users: UserModel.User[] = await this.userRepo.searchUsers(ctx.params.input);
      return {
        code: 200,
        message: "Get user success",
        data: users,
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

      const isValidEmail = await ctx.broker.call("mailer.validateMail", { email: ctx.params.username });
      if (!isValidEmail) {
        throw new Errors.MoleculerClientError("Invalid email", 400);
      };

      // Hash password to store in db
      const SALT = 12;
      const hashedPassword = await bcrypt.hash(registerDto.password, SALT);
      registerDto.password = hashedPassword;

      const accountId: string = await this.userRepo.createUserWithAccount(registerDto);

      const sendMailParams: SendMailDto = {
        receiver: ctx.params.username,
        subject: "Verify account",
        template: "verification",
        payload: { verifyLink: `${process.env.ROOT_DOMAIN}/api/users/validate?accountId=${accountId}` },
      };
      await ctx.broker.call("mailer.sendMail", sendMailParams);
  
      return {
        code: 201,
        message: "Registration success",
        data: accountId,
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
      
      if (account.status !== AccountStatus.ACTIVE) {
        throw new Errors.MoleculerClientError("Your account is not active yet", 401);
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
  public validateAccount = async (ctx: Context<{accountId: string}>): Promise<IApiResponse> => {
    try{
      await this.userRepo.activateAccount(ctx.params.accountId);
      return {
        code: 200,
        message: "Your account has been activated",
      };
    }catch(error){
      handleError(error);
    }
  };
  // Follow actions
  public editFollowing = async (ctx: Context<FollowingDto>): Promise<IApiResponse> => {
    try {
      const hasFollowed: boolean = await this.userRepo.checkHasFollowed(ctx.params);
      if(ctx.params.actionType === FollowingAction.FOLLOW){
        if(!hasFollowed){      
          ctx.broker.broadcast("notification.create", {
            from: ctx.params.userId,
            to: ctx.params.targetId,
            type: TypeNotification.FOLLOW,
            content: "Đã theo dõi bạn",
            link: `/user/${ctx.params.userId}`,
          });
        }
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
