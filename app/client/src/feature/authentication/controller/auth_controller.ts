import { AuthApi } from "../model/auth_api";
import { AuthLogin } from "../model/auth_type";

export class AuthController {
  authApi: AuthApi;

  constructor(authApi: AuthApi) {
    this.authApi = authApi;
  }

  async login(param: AuthLogin): Promise<string | null | undefined> {
    const token = await this.authApi.login(param);

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
