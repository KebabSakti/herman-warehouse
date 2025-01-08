import { useState } from "react";
import { Result, State } from "../../../common/type";
import { InstallmentController } from "../controller/installment_controller";
import { Installment } from "../model/installment_model";
import { InstallmentList, InstallmentCreate } from "../model/installment_types";

type InstallmentState = State<
  Result<Installment[]> | Installment | null | undefined
>;

export type InstallmentHookType = {
  state: InstallmentState;
  list(
    invoiceId: string,
    param?: InstallmentList | null | undefined,
    extra?: Record<string, any>
  ): Promise<void>;
  create(param: InstallmentCreate, extra?: Record<string, any>): Promise<void>;
  remove(id: string, extra?: Record<string, any>): Promise<void>;
};

export function useInstallmentHook(
  installmentController: InstallmentController
): InstallmentHookType {
  const [state, setState] = useState<InstallmentState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    invoiceId: string,
    param?: InstallmentList | null | undefined,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "list", status: "loading" });
      const data = await installmentController.list(invoiceId, param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "list", status: "complete", error: error });
    }
  }

  async function create(
    param: InstallmentCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "create", status: "loading" });
      await installmentController.create(param, extra);
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
      await installmentController.remove(id, extra);
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
