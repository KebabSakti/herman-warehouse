import { Dashboard, DashboardRead } from "./dashboard_model";

export interface DashboardApi {
  read(param: DashboardRead, extra?: Record<string, any>): Promise<Dashboard>;
}
