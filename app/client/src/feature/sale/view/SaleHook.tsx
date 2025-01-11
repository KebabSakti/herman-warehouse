import { useState } from "react";
import { State } from "../../../common/type";
import { SaleController } from "../controller/sale_controller";
import { SaleList, SaleSummary } from "../model/sale_model";

type SaleState = State<SaleSummary>;

export type SaleHookType = {
  state: SaleState;
  list(param: SaleList, extra?: Record<string, any>): Promise<void>;
};

export function useSaleHook(saleController: SaleController): SaleHookType {
  const [state, setState] = useState<SaleState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    param: SaleList,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "list", status: "loading" });
      const data = await saleController.list(param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "list", status: "complete", error: error });
    }
  }

  return { state, list };
}
