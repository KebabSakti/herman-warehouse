import { useState } from "react";
import { Result, State } from "../../../common/type";
import { PurchaseController } from "../controller/purchase_controller";
import { Purchase, PurchaseList } from "../model/purchase_type";

type PurchaseState = State<Result<Purchase | Purchase[]> | null | undefined>;

export type PurchaseHookType = {
  state: PurchaseState;
  list(param: PurchaseList, extra?: Record<string, any>): Promise<void>;
};

export function usePurchaseHook(
  purchaseController: PurchaseController
): PurchaseHookType {
  const [state, setState] = useState<PurchaseState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    param: PurchaseList,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "list", status: "loading" });
      const data = await purchaseController.list(param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "list", status: "complete", error: error });
    }
  }

  return { state, list };
}
