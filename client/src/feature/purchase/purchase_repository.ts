import axios from "axios";
import { server } from "../../common/common";
import { Failure } from "../../common/error";
import { Result } from "../../common/type";
import { Purchase, PurchaseListParam } from "./purchase_type";

export class PurchaseRepository {
  async list(
    param: PurchaseListParam,
    token: string
  ): Promise<Result<Purchase[]>> {
    try {
      const result = await axios.get(`${server}/app/purchase`, {
        params: param,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return result.data;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }
}
