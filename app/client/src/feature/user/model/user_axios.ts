import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { hmac } from "../../../helper/util";
import { UserApi } from "./user_api";
import {
  User,
  UserCreate,
  UserList,
  UserLogin,
  UserSummary,
  UserUpdate,
} from "./user_type";

export class UserAxios implements UserApi {
  async create(
    param: UserCreate,
    extra?: Record<string, any> | null | undefined
  ): Promise<void> {
    try {
      const payload = JSON.stringify(param);
      const signature = await hmac(payload, extra!.token);

      await axios({
        url: `${SERVER}/user`,
        method: "post",
        data: payload,
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
          "X-Signature": signature,
        },
      });
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async read(
    id: string,
    extra?: Record<string, any> | null | undefined
  ): Promise<User | null | undefined> {
    try {
      const result = await axios({
        url: `${SERVER}/user/${id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
        },
      });

      return result.data;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async update(
    id: string,
    param: UserUpdate,
    extra?: Record<string, any> | null | undefined
  ): Promise<void> {
    try {
      const payload = JSON.stringify(param);
      const signature = await hmac(payload, extra!.token);

      const result = await axios({
        url: `${SERVER}/user/${id}`,
        method: "put",
        data: payload,
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
          "X-Signature": signature,
        },
      });

      return result.data;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async delete(
    id: string,
    extra?: Record<string, any> | null | undefined
  ): Promise<void> {
    try {
      const result = await axios({
        url: `${SERVER}/user/${id}`,
        method: "delete",
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
        },
      });

      return result.data;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async list(
    param: UserList,
    extra?: Record<string, any> | null | undefined
  ): Promise<UserSummary> {
    try {
      const result = await axios({
        url: `${SERVER}/user`,
        method: "get",
        params: param,
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
        },
      });

      return result.data;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async login(param: UserLogin): Promise<string | null | undefined> {
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
