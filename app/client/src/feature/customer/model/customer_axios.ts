import axios from "axios";
import { server } from "../../../common/common";
import { Failure } from "../../../common/error";
import { Result } from "../../../common/type";
import { CustomerApi } from "./customer_api";
import { Customer } from "./customer_model";
import { CustomerCreate, CustomerList, CustomerUpdate } from "./customer_type";

export class CustomerAxios implements CustomerApi {
  async create(
    param: CustomerCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      await axios({
        url: `${server}/app/customer`,
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
    extra?: Record<string, any>
  ): Promise<Customer | null | undefined> {
    try {
      const result = await axios({
        url: `${server}/app/customer/${id}`,
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
      await axios({
        url: `${server}/app/customer/${id}`,
        method: "put",
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

  async remove(id: string, extra?: Record<string, any>): Promise<void> {
    try {
      await axios({
        url: `${server}/app/customer/${id}`,
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
      const result = await axios.get(`${server}/app/customer`, {
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
