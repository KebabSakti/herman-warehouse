import { DashboardApi } from "../model/dashboard_api";
import { Dashboard, DashboardRead } from "../model/dashboard_model";

export class DashboardController {
  private dashboardApi: DashboardApi;

  constructor(dashboardApi: DashboardApi) {
    this.dashboardApi = dashboardApi;
  }

  async read(
    param: DashboardRead,
    extra?: Record<string, any>
  ): Promise<Dashboard> {
    const result = await this.dashboardApi.read(param, extra);

    return result;
  }
}
