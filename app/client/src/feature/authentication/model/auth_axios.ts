import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { AuthApi } from "./auth_api";
import { AuthLogin } from "./auth_type";

export class AuthAxios implements AuthApi {
  async login(param: AuthLogin): Promise<string | null | undefined> {
    try {
      const result = await axios({
        url: `${SERVER}/login`,
        method: "post",
        data: param,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return result.data?.token;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }
}
