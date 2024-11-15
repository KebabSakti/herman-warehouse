import axios from "axios";
import { server } from "../../../common/common";
import { Failure } from "../../../common/error";
import { AuthLoginParam } from "../model/auth_type";

export class AuthRepository {
  async login(param: AuthLoginParam): Promise<string> {
    try {
      const response = await axios.post(`${server}/login`, param, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("token", response.data.token);

      return response.data.token;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  load(): string | null | undefined {
    const token = localStorage.getItem("token");

    return token;
  }

  logout(): void {
    localStorage.removeItem("token");
  }
}
