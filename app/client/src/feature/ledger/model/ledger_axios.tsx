import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { Result } from "../../../common/type";
import { hmac } from "../../../helper/util";
import { LedgerApi } from "./ledger_api";
import { Ledger } from "./ledger_model";
import { LedgerCreate, LedgerList } from "./ledger_type";

export class LedgerAxios implements LedgerApi {
  async create(
    param: LedgerCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      const formData = new FormData();

      if (param.file) {
        formData.append("file", param.file as File);
      }

      const payload = JSON.stringify(param);
      const signature = await hmac(payload, extra!.token);
      formData.append("payload", payload);

      await axios({
        url: `${SERVER}/app/ledger`,
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

  async remove(id: string, extra?: Record<string, any>): Promise<void> {
    try {
      await axios({
        url: `${SERVER}/app/ledger/${id}`,
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
    purchaseId: string,
    param?: LedgerList | null | undefined,
    extra?: Record<string, any>
  ): Promise<Result<Ledger[]>> {
    try {
      const result = await axios.get(`${SERVER}/app/ledger/${purchaseId}`, {
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
