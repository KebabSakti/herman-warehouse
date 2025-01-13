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

  logout(): void {
    localStorage.removeItem("token");
  }

  load(): string | null | undefined {
    const token = localStorage.getItem("token");

    return token;
  }

  async login(param: UserLogin): Promise<string | null | undefined> {
    const token = await this.userApi.login(param);

    if (token) {
      localStorage.setItem("token", token);
    }

    return token;
  }

  async create(param: UserCreate, extra?: Record<string, any>): Promise<void> {
    await this.userApi.create(param, extra);
  }

  async update(
    id: string,
    param: UserUpdate,
    extra?: Record<string, any>
  ): Promise<void> {
    await this.userApi.update(id, param, extra);
  }

  async list(
    param: UserList,
    extra?: Record<string, any>
  ): Promise<UserSummary> {
    const result = await this.userApi.list(param, extra);

    return result;
  }

  async read(
    id: string,
    extra?: Record<string, any>
  ): Promise<User | null | undefined> {
    const result = await this.userApi.read(id, extra);

    return result;
  }

  async remove(id: string, extra?: Record<string, any>): Promise<void> {
    await this.userApi.delete(id, extra);
  }
}
