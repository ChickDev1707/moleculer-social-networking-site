import { inspect } from "util";
import { dirname } from "path";
import * as dotenv from "dotenv";
import { pick } from "lodash";
import Neode from "neode";
import { CreateUserDto } from "../dtos/create-user.dto";
import { RegisterDto } from "../dtos/register.dto";

const userDir = dirname(__dirname);
dotenv.config();

export class UserRepository {
  private instance = new Neode(process.env.USER_DB_URI, process.env.USER_DB_USERNAME, process.env.USER_DB_PASSWORD)
    .withDirectory(userDir + "/models");

  public async createUser() {

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
    const newUser: any = null;
    return newUser;
  }

  public async findAccountByUsername(username: string) {
    const query = `Match (u:User)-[:HAS]->(a:Account {username: '${username}'}) return a`;

  }
}
