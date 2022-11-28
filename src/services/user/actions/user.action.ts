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
import { FollowDto } from "../dtos/follow.dto";
dotenv.config();

export class UserAction {
  private userRepo = new UserRepository();

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

  public follow = async (ctx: Context<FollowDto>): Promise<IApiResponse> => {
    try {
      const hasFollowed: boolean = await this.userRepo.checkHasFollowed(ctx.params);
      if(hasFollowed){
        throw new Errors.MoleculerClientError("You already follow this user", 400);
      }
      await this.userRepo.addFollowing(ctx.params);
      return {
        code: 200,
        message: "Follow success",
        data: null,
      };
    } catch (error) {
      handleError(error);
    }
  };

  public getFollowings = async (ctx: Context<{userId: string}>): Promise<IApiResponse> => {
    try {
      const followings = await this.userRepo.getFollowings(ctx.params.userId);
      return {
        code: 200,
        message: "Get following list success",
        data: followings,
      };
    } catch (error) {
      handleError(error);
    }
  };

  private generateTokens = (userId: string): [string, string] => {

    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    return [accessToken, refreshToken];
  };

};
