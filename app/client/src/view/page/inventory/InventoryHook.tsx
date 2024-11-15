import { useState } from "react";
import { Result, State } from "../../../common/type";
import { Purchase, PurchaseListParam } from "../../../feature/purchase/purchase_type";
import { purchaseRepository } from "../../service";

type InventoryState = State<Result<Purchase | Purchase[]> | null | undefined>;

export type InventoryHookType = {
  state: InventoryState;
  list(param: PurchaseListParam, token: string): Promise<void>;
};

export function useInventoryHook(): InventoryHookType {
  const [state, setState] = useState<InventoryState>({
    action: "idle",
    status: "idle",
  });

  async function list(param: PurchaseListParam, token: string): Promise<void> {
    try {
      setState({ action: "list", status: "loading" });
      const data = await purchaseRepository.list(param, token);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ action: "list", status: "complete", error: error });
    }
  }

  return { state, list };
}
