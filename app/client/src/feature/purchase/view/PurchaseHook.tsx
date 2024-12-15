import { useState } from "react";
import { Result, State } from "../../../common/type";
import { PurchaseController } from "../controller/purchase_controller";
import { Purchase } from "../model/purchase_model";
import {
  PurchaseCreate,
  PurchaseList,
  PurchaseUpdate,
} from "../model/purchase_type";

type PurchaseState = State<Result<Purchase[]> | Purchase | null | undefined>;

export type PurchaseHookType = {
  state: PurchaseState;
  list(param: PurchaseList, extra?: Record<string, any>): Promise<void>;
  create(param: PurchaseCreate, extra?: Record<string, any>): Promise<void>;
  read(id: string, extra?: Record<string, any>): Promise<void>;
  update(
    id: string,
    param: PurchaseUpdate,
    extra?: Record<string, any>
  ): Promise<void>;
  remove(id: string, extra?: Record<string, any>): Promise<void>;
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

  async function create(
    param: PurchaseCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "create", status: "loading" });
      await purchaseController.create(param, extra);
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
      const data = await purchaseController.read(id, extra);
      setState({ action: "read", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "read", status: "complete", error: error });
    }
  }

  async function update(
    id: string,
    param: PurchaseUpdate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "update", status: "loading" });
      await purchaseController.update(id, param, extra);
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
      await purchaseController.delete(id, extra);
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
