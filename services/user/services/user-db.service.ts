import { inspect } from "util";
import { driver, auth } from "neo4j-driver";
import * as dotenv from "dotenv";
import { CreateUserDto } from "../dtos/create-user.dto";
dotenv.config();

export class UserDbService{
  private dbDriver = driver(process.env.USER_DB_URI, auth.basic(process.env.USER_DB_USERNAME, process.env.USER_DB_PASSWORD));
  private session = this.dbDriver.session();

  public async createUser(user: CreateUserDto){
    const query = `Create (:User ${inspect(user)})`;
    const newUser = await this.session.run(query);
    return newUser;
  }

  public async findUserById(id: string){
    const query = `Match (:User {id: ${id}})`;
    return this.session.run(query);
  }
}
