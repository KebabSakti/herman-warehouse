import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { Result } from "../../../common/type";
import { CustomerApi } from "./customer_api";
import { Customer } from "./customer_model";
import { CustomerCreate, CustomerList, CustomerUpdate } from "./customer_type";
import { hmac } from "../../../helper/util";

export class CustomerAxios implements CustomerApi {
  async create(
    param: CustomerCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      const payload = JSON.stringify(param);
      const signature = await hmac(payload, extra!.token);

      await axios({
        url: `${SERVER}/app/customer`,
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
    extra?: Record<string, any>
  ): Promise<Customer | null | undefined> {
    try {
      const result = await axios({
        url: `${SERVER}/app/customer/${id}`,
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
    param: CustomerUpdate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      const payload = JSON.stringify(param);
      const signature = await hmac(payload, extra!.token);

      await axios({
        url: `${SERVER}/app/customer/${id}`,
        method: "put",
        data: param,
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

  async remove(id: string, extra?: Record<string, any>): Promise<void> {
    try {
      await axios({
        url: `${SERVER}/app/customer/${id}`,
        method: "delete",
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async list(
    param: CustomerList,
    extra?: Record<string, any>
  ): Promise<Result<Customer[]>> {
    try {
      const result = await axios.get(`${SERVER}/app/customer`, {
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
}
