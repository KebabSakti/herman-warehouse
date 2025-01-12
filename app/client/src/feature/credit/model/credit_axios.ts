import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { CreditApi } from "./credit_api";
import { CreditList, CreditSummary } from "./credit_model";

export class CreditAxios implements CreditApi {
  async list(
    param: CreditList,
    extra?: Record<string, any>
  ): Promise<CreditSummary> {
    try {
      const result = await axios.get(`${SERVER}/app/credit`, {
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
