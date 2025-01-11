import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { Result } from "../../../common/type";
import { hmac } from "../../../helper/util";
import { PurchaseApi } from "./purchase_api";
import { Purchase } from "./purchase_model";
import { PurchaseCreate, PurchaseList, PurchaseUpdate } from "./purchase_type";

export class PurchaseAxios implements PurchaseApi {
  async create(
    param: PurchaseCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      const formData = new FormData();

      if (param.ledger && param.ledger.length > 0 && param.ledger[0].file) {
        formData.append("file", param.ledger[0].file as File);
      }

      const payload = JSON.stringify(param);
      const signature = await hmac(payload, extra!.token);
      formData.append("payload", payload);

      await axios({
        url: `${SERVER}/app/purchase`,
        method: "post",
        data: formData,
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "multipart/form-data",
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
  ): Promise<Purchase | null | undefined> {
    try {
      const result = await axios({
        url: `${SERVER}/app/purchase/${id}`,
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
    param: PurchaseUpdate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      const payload = JSON.stringify(param);
      const signature = await hmac(payload, extra!.token);

      await axios({
        url: `${SERVER}/app/purchase/${id}`,
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
        url: `${SERVER}/app/purchase/${id}`,
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
    param: PurchaseList,
    extra?: Record<string, any>
  ): Promise<Result<Purchase[]>> {
    try {
      const result = await axios.get(`${SERVER}/app/purchase`, {
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

  async findBySupplierId(
    id: string,
    param?: Record<string, any> | null | undefined,
    extra?: Record<string, any> | null | undefined
  ): Promise<Result<Purchase[]>> {
    try {
      const result = await axios.get(`${SERVER}/app/purchase/find/${id}`, {
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
