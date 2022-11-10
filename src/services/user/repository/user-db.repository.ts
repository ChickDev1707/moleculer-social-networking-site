import { inspect } from "util";
import { driver, auth } from "neo4j-driver";
import * as dotenv from "dotenv";
import { pick } from "lodash";
import { CreateUserDto } from "../dtos/create-user.dto";
import { RegisterDto } from "../dtos/register.dto";
dotenv.config();

export class UserRepository {
  private dbDriver = driver(process.env.USER_DB_URI, auth.basic(process.env.USER_DB_USERNAME, process.env.USER_DB_PASSWORD));
  private session = this.dbDriver.session();

  public async createUser(user: CreateUserDto) {
    const query = `Create (:User ${inspect(user)})`;
    const newUser = await this.session.run(query);
    return newUser;
  }
  /**
   * Create new user (and add new account) when register to site
   * @param registerDto
   * @returns newUser
   */
  public async createUserWithAccount(registerDto: RegisterDto) {
    // Pick user data from register data
    const userData = pick(registerDto, ["name", "gender", "dateOfBirth"]);
    // Pick account data from register data
    const userAccount = pick(registerDto, ["username", "password"]);

    const query = `Create (:User ${inspect(userData)})-[:HAS]->(:Account ${inspect(userAccount)})`;
    const newUser = await this.session.run(query);
    return newUser;
  }

  public async findAccountByUsername(username: string) {
    const query = `Match (u:User)-[:HAS]->(a:Account {username: '${username}'}) return a`;
    return this.session.run(query);
  }
}
