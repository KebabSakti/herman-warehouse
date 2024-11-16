import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserApi } from "../model/user_api";
import { User, UserLogin } from "../model/user_type";

export class UserController {
  private userApi: UserApi;

  constructor(userApi: UserApi) {
    this.userApi = userApi;
  }

  async login(param: UserLogin): Promise<string | null | undefined> {
    const user = await this.userApi.find(param.uid);

    if (user != null) {
      const passwordIsValid = await bcrypt.compare(
        param.password,
        user.password!
      );

      if (passwordIsValid) {
        const token = jwt.sign(user.id!, process.env.UUID!);

        return token;
      }
    }

    return null;
  }

  async validate(token: string): Promise<User | null | undefined> {
    const result = jwt.verify(token, process.env.UUID!) as string;
    const user = await this.userApi.read(result);

    return user;
  }
}
