import { useState } from "react";
import { State } from "../../../common/type";
import { DashboardController } from "../controller/dashboard_controller";
import { Dashboard, DashboardRead } from "../model/dashboard_model";

type DashboardState = State<Dashboard>;

export type DashboardHookType = {
  state: DashboardState;
  read(param: DashboardRead, extra?: Record<string, any>): Promise<void>;
};

export function useDashboardHook(
  dashboardController: DashboardController
): DashboardHookType {
  const [state, setState] = useState<DashboardState>({
    action: "idle",
    status: "idle",
  });

  async function read(
    param: DashboardRead,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "read", status: "loading" });
      const data = await dashboardController.read(param, extra);
      setState({ action: "read", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "read", status: "complete", error: error });
    }
  }

  return { state, read };
}
