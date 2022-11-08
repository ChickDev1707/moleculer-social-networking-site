import { Context, Errors } from "moleculer";
import { IApiResponse } from "src/configs/api.type";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserDbService } from "../services/user-db.service";

export class UserAction {
  private userDbService = new UserDbService();

  public createUser = async (ctx: Context<CreateUserDto>): Promise<IApiResponse> =>{
    try {
      console.log(this);
      const newUser = await this.userDbService.createUser(ctx.params);
      return { code: 201, message: "Created user", data: newUser};
    } catch (error) {
      throw new Errors.MoleculerError("Internal server error", 500);
    }
  };
}
