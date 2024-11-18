import { UserApi } from "../model/user_api";
import { UserLogin } from "../model/user_type";

export class UserController {
  private userApi: UserApi;

  constructor(userApi: UserApi) {
    this.userApi = userApi;
  }

  async login(param: UserLogin): Promise<string | null | undefined> {
    const token = await this.userApi.login(param);

    if (token) {
      localStorage.setItem("token", token);
    }

    return token;
  }

  logout(): void {
    localStorage.removeItem("token");
  }

  load(): string | null | undefined {
    const token = localStorage.getItem("token");

    return token;
  }
}
