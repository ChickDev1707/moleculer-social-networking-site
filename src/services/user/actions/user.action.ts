import { Context, Errors } from "moleculer";
import * as bcrypt from "bcrypt";
import Record from "neode/node_modules/neo4j-driver-core/types/record";
import { IApiResponse } from "../../../../configs/api.type";
import { LoginDto } from "../dtos/login.dto";
import { UserRepository } from "../repository/user.repository";
import { RegisterDto } from "../dtos/register.dto";
import { handleError } from "../../../utils/erros.util";
import { UserModel } from "../types/types";

export class UserAction {
  private userRepo = new UserRepository();

  public register = async (ctx: Context<RegisterDto>): Promise<IApiResponse> => {
    try {
      const registerDto: RegisterDto = ctx.params;

      // Validate user name
      const [account]: [UserModel.Account, UserModel.User]= await this.userRepo.findAccountByUsername(registerDto.username);
      if (account) {
        throw new Errors.MoleculerClientError("Username already exists", 400);
      }

      // Hash password to store in db
      const SALT = 12;
      const hashedPassword = await bcrypt.hash(registerDto.password, SALT);
      registerDto.password = hashedPassword;

      const newUser: Record = await this.userRepo.createUserWithAccount(registerDto);

      // Generate token
      if (newUser) {
        return {
          code: 201,
          message: "Create new user success",
          data: newUser,
        };
      }
    } catch (error) {
      handleError(error);
    }
  };
  public login = async (ctx: Context<LoginDto>): Promise<IApiResponse> => {
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

      return {
        code: 200,
        message: "Login success",
        data: user,
      };
      // Transform user entity (remove password and all protected fields)
    } catch (error) {
      handleError(error);
    }
  };
};
