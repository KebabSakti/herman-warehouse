import axios from "axios";
import { server } from "../../../common/common";
import { Failure } from "../../../common/error";
import { Result } from "../../../common/type";
import { PurchaseApi } from "./purchase_api";
import { Purchase } from "./purchase_model";

export class PurchaseAxios implements PurchaseApi {
  async list(
    param: Purchase,
    extra?: Record<string, any>
  ): Promise<Result<Purchase[]>> {
    try {
      const result = await axios.get(`${server}/app/purchase`, {
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
