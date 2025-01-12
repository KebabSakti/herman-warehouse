import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { OutstandingApi } from "./credit_api";
import { OutstandingList, OutstandingSummary } from "./credit_model";

export class OutstandingAxios implements OutstandingApi {
  async list(
    param: OutstandingList,
    extra?: Record<string, any>
  ): Promise<OutstandingSummary> {
    try {
      const result = await axios.get(`${SERVER}/app/outstanding`, {
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
