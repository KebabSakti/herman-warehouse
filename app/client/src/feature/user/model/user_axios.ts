import axios from "axios";
import { server } from "../../../common/common";
import { Failure } from "../../../common/error";
import { Result } from "../../../common/type";
import { UserApi } from "./user_api";
import { User, UserCreate, UserList, UserLogin, UserUpdate } from "./user_type";

export class UserAxios implements UserApi {
  async create(
    param: UserCreate,
    extra?: Record<string, any> | null | undefined
  ): Promise<void> {
    try {
      await axios({
        url: `${server}/user`,
        method: "post",
        data: param,
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
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
        url: `${server}/user/${id}`,
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
      const result = await axios({
        url: `${server}/user/${id}`,
        method: "put",
        data: param,
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

  async delete(
    id: string,
    extra?: Record<string, any> | null | undefined
  ): Promise<void> {
    try {
      const result = await axios({
        url: `${server}/user/${id}`,
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
  ): Promise<Result<User[]>> {
    try {
      const result = await axios({
        url: `${server}/user`,
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
        url: `${server}/login`,
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
