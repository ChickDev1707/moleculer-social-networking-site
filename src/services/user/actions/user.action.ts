import { Context, Errors } from "moleculer";
import * as bcrypt from "bcrypt";
import { IApiResponse } from "../../../../configs/api.type";
import { CreateUserDto } from "../dtos/create-user.dto";
import { LoginDto } from "../dtos/login.dto";
import { UserRepository } from "../repository/user.repository";
import { RegisterDto } from "../dtos/register.dto";

export class UserAction {
  private userRepo = new UserRepository();

  public createUser = async (ctx: Context<CreateUserDto>): Promise<IApiResponse> => {
    try {
      const newUser = await this.userRepo.createUser();
      return { code: 201, message: "Created user", data: newUser };
    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };
  public register = async (ctx: Context<RegisterDto>): Promise<IApiResponse> => {
    const user = await this.userRepo.createUser();
    return {
      code: 201,
      message: "Create new user success",
      data: user,
    };
  };
  public login = async (ctx: Context<LoginDto>): Promise<IApiResponse> => {
    try {
      const { username, password } = ctx.params;

      const account = await this.userRepo.findAccountByUsername(username);
      // if (!account) { throw new Errors.MoleculerClientError("Account does not exist", 401); }

      // Const isValidated = await bcrypt.compare(password, account.password);
      // If (!isValidated) { throw new Errors.MoleculerClientError("Wrong password!", 401); }

      return {
        code: 200,
        message: "Login success",
      };
      // Transform user entity (remove password and all protected fields)
    } catch (error) {
      throw new Errors.MoleculerClientError("Internal server error", 500);
    }
  };
}
