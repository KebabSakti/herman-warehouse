import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { SaleApi } from "./sale_api";
import { SaleList, SaleSummary } from "./sale_model";

export class SaleAxios implements SaleApi {
  async list(
    param: SaleList,
    extra?: Record<string, any>
  ): Promise<SaleSummary> {
    try {
      const result = await axios.get(`${SERVER}/app/sale`, {
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
