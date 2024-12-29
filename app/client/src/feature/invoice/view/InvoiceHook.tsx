import { useState } from "react";
import { Result, State } from "../../../common/type";
import { InvoiceController } from "../controller/invoice_controller";
import { Invoice } from "../model/invoice_model";
import { InvoiceCreate, InvoiceList } from "../model/invoice_type";

type InvoiceState = State<Result<Invoice[]> | Invoice | null | undefined>;

export type InvoiceHookType = {
  state: InvoiceState;
  list(param: InvoiceList, extra?: Record<string, any>): Promise<void>;
  create(param: InvoiceCreate, extra?: Record<string, any>): Promise<void>;
  read(id: string, extra?: Record<string, any>): Promise<void>;
  remove(id: string, extra?: Record<string, any>): Promise<void>;
};

export function useInvoiceHook(
  invoiceController: InvoiceController
): InvoiceHookType {
  const [state, setState] = useState<InvoiceState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    param: InvoiceList,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "list", status: "loading" });
      const data = await invoiceController.list(param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "list", status: "complete", error: error });
    }
  }

  async function create(
    param: InvoiceCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "create", status: "loading" });
      await invoiceController.create(param, extra);
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

  async function read(id: string, extra?: Record<string, any>): Promise<void> {
    try {
      setState({ ...state, action: "read", status: "loading" });
      const data = await invoiceController.read(id, extra);
      setState({ action: "read", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "read", status: "complete", error: error });
    }
  }

  async function remove(
    id: string,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "remove", status: "loading" });
      await invoiceController.remove(id, extra);
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

  return { state, list, create, read, remove };
}
