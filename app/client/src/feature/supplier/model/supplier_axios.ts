import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { Result } from "../../../common/type";
import { SupplierApi } from "./supplier_api";
import { Supplier } from "./supplier_model";
import { SupplierCreate, SupplierList, SupplierUpdate } from "./supplier_type";
import { hmac } from "../../../helper/util";

export class SupplierAxios implements SupplierApi {
  async create(
    param: SupplierCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      const payload = JSON.stringify(param);
      const signature = await hmac(payload, extra!.token);

      await axios({
        url: `${SERVER}/app/supplier`,
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
  ): Promise<Supplier | null | undefined> {
    try {
      const result = await axios({
        url: `${SERVER}/app/supplier/${id}`,
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
    param: SupplierUpdate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      const payload = JSON.stringify(param);
      const signature = await hmac(payload, extra!.token);

      await axios({
        url: `${SERVER}/app/supplier/${id}`,
        method: "put",
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

  async delete(id: string, extra?: Record<string, any>): Promise<void> {
    try {
      await axios({
        url: `${SERVER}/app/supplier/${id}`,
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
    param: SupplierList,
    extra?: Record<string, any>
  ): Promise<Result<Supplier[]>> {
    try {
      const result = await axios({
        url: `${SERVER}/app/supplier`,
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
}
