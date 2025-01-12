import { useState } from "react";
import { State } from "../../../common/type";
import { ProfitController } from "../controller/profit_controller";
import { ProfitList, ProfitSummary } from "../model/profit_model";

type ProfitState = State<ProfitSummary>;

export type ProfitHookType = {
  state: ProfitState;
  list(param: ProfitList, extra?: Record<string, any>): Promise<void>;
};

export function useProfitHook(
  profitController: ProfitController
): ProfitHookType {
  const [state, setState] = useState<ProfitState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    param: ProfitList,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "list", status: "loading" });
      const data = await profitController.list(param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "list", status: "complete", error: error });
    }
  }

  return { state, list };
}
