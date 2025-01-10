import { useState } from "react";
import { Result, State } from "../../../common/type";
import { LedgerController } from "../controller/ledger_controller";
import { Ledger } from "../model/ledger_model";
import { LedgerCreate, LedgerList } from "../model/ledger_type";

type LedgerState = State<Result<Ledger[]> | Ledger | null | undefined>;

export type LedgerHookType = {
  state: LedgerState;
  list(
    purchaseId: string,
    param?: LedgerList | null | undefined,
    extra?: Record<string, any>
  ): Promise<void>;
  create(param: LedgerCreate, extra?: Record<string, any>): Promise<void>;
  remove(id: string, extra?: Record<string, any>): Promise<void>;
};

export function useLedgerHook(
  ledgerController: LedgerController
): LedgerHookType {
  const [state, setState] = useState<LedgerState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    purchaseId: string,
    param?: LedgerList | null | undefined,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "list", status: "loading" });
      const data = await ledgerController.list(purchaseId, param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "list", status: "complete", error: error });
    }
  }

  async function create(
    param: LedgerCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "create", status: "loading" });
      await ledgerController.create(param, extra);
      setState({ action: "create", status: "complete" });
    } catch (error: any) {
      setState({
        ...state,
        action: "create",
        status: "complete",
        error: error,
      });
    }
  }

  async function remove(
    id: string,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "remove", status: "loading" });
      await ledgerController.remove(id, extra);
      setState({ action: "remove", status: "complete" });
    } catch (error: any) {
      setState({
        ...state,
        action: "remove",
        status: "complete",
        error: error,
      });
    }
  }

  return { state, list, create, remove };
}
