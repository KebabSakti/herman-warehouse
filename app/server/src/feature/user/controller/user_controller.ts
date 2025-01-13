import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserApi } from "../model/user_api";
import {
  User,
  UserCreate,
  UserList,
  UserLogin,
  UserSummary,
  UserUpdate,
} from "../model/user_type";

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

  async create(param: UserCreate): Promise<void> {
    const password = await bcrypt.hash(param.password, 10);
    const payload = { ...param, password: password };

    await this.userApi.create(payload);
  }

  async list(param: UserList): Promise<UserSummary> {
    const result = await this.userApi.list(param);

    return result;
  }

  async read(id: string): Promise<User | null | undefined> {
    const result = await this.userApi.read(id);

    return result;
  }

  async update(id: string, param: UserUpdate): Promise<void> {
    let payload = param;

    if (param.password) {
      const password = await bcrypt.hash(param.password, 10);
      payload = { ...param, password: password };
    }

    await this.userApi.update(id, payload);
  }

  async remove(id: string): Promise<void> {
    await this.userApi.delete(id);
  }
}
