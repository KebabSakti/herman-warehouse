import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { DashboardApi } from "./dashboard_api";
import { Dashboard, DashboardRead } from "./dashboard_model";

export class DashboardAxios implements DashboardApi {
  async read(
    param: DashboardRead,
    extra?: Record<string, any>
  ): Promise<Dashboard> {
    try {
      const result = await axios.get(`${SERVER}/app/dashboard`, {
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
