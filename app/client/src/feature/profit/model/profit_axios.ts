import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { ProfitApi } from "./profit_api";
import { ProfitList, ProfitSummary } from "./profit_model";

export class ProfitAxios implements ProfitApi {
  async list(
    param: ProfitList,
    extra?: Record<string, any>
  ): Promise<ProfitSummary> {
    try {
      const result = await axios.get(`${SERVER}/app/profit`, {
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
