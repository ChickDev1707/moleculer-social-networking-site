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
import { CustomJwtPayload } from "../types/jwt-payload.type";
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
  public login = async (ctx: Context<LoginDto, {accessToken: string}>): Promise<IApiResponse> => {
    try {
      if(ctx.meta.accessToken){
        // Handle login with access token
        await this.handleLoginWithToken(ctx.meta.accessToken);
      }else{
        return this.handleLoginWithoutToken(ctx.params);
      }
    } catch (error) {
      handleError(error);
    }
  };
  private handleLoginWithToken = async (accessToken: string): Promise<IApiResponse> => {
    try{
      const token: CustomJwtPayload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as CustomJwtPayload;

      const user: UserModel.User = await this.userRepo.findUserById(token.userId);
      if(!user) {
        // User in token is invalid
        throw new Errors.MoleculerClientError("Unauthorized", 404);
      }
      return {
        code: 200,
        message: "Login success",
      };
    }catch(error){
      throw new Errors.MoleculerClientError("Unauthorized", 404);
    }
  };
  private handleLoginWithoutToken = async (params: LoginDto): Promise<IApiResponse> => {
    const { username, password } = params;

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
      data: {user, accessToken},
    };
  };

  private generateTokens = (userId: string): [string, string] => {

    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    return [accessToken, refreshToken];
  };

};
