import { Dashboard, DashboardRead } from "./dashboard_model";

export interface DashboardApi {
  read(param: DashboardRead): Promise<Dashboard>;
}
