import { useState } from "react";
import { State } from "../../../common/type";
import { CreditController } from "../controller/credit_controller";
import { CreditList, CreditSummary } from "../model/credit_model";

type CreditState = State<CreditSummary>;

export type CreditHookType = {
  state: CreditState;
  list(param: CreditList, extra?: Record<string, any>): Promise<void>;
};

export function useCreditHook(
  creditController: CreditController
): CreditHookType {
  const [state, setState] = useState<CreditState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    param: CreditList,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "list", status: "loading" });
      const data = await creditController.list(param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "list", status: "complete", error: error });
    }
  }

  return { state, list };
}
