import { useState } from "react";
import { Result, State } from "../../../common/type";
import { SupplierController } from "../controller/supplier_controller";
import { Supplier } from "../model/supplier_model";

type SupplierState = State<Result<Supplier[]> | Supplier | null | undefined>;

export type SupplierHookType = {
  state: SupplierState;
  list(param: Supplier, extra?: Record<string, any>): Promise<void>;
  create(param: Supplier, extra?: Record<string, any>): Promise<void>;
  read(id: string, extra?: Record<string, any>): Promise<void>;
  update(
    id: string,
    param: Supplier,
    extra?: Record<string, any>
  ): Promise<void>;
  remove(id: string, extra?: Record<string, any>): Promise<void>;
};

export function useSupplierHook(
  controller: SupplierController
): SupplierHookType {
  const [state, setState] = useState<SupplierState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    param: Supplier,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "list", status: "loading" });
      const data = await controller.list(param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "list", status: "complete", error: error });
    }
  }

  async function create(
    param: Supplier,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "create", status: "loading" });
      await controller.create(param, extra);
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
      const data = await controller.read(id, extra);
      setState({ action: "read", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "read", status: "complete", error: error });
    }
  }

  async function update(
    id: string,
    param: Supplier,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "update", status: "loading" });
      await controller.update(id, param, extra);
      setState({ action: "update", status: "complete" });
    } catch (error: any) {
      setState({
        ...state,
        action: "update",
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
      await controller.delete(id, extra);
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

  return { state, list, create, read, update, remove };
}
