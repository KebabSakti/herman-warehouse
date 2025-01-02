import { useState } from "react";
import { Result, State } from "../../../common/type";
import { CustomerController } from "../controller/customer_controller";
import { Customer } from "../model/customer_model";
import {
  CustomerCreate,
  CustomerList,
  CustomerUpdate,
} from "../model/customer_type";

type CustomerState = State<Result<Customer[]> | Customer | null | undefined>;

export type CustomerHookType = {
  state: CustomerState;
  list(param: CustomerList, extra?: Record<string, any>): Promise<void>;
  create(param: CustomerCreate, extra?: Record<string, any>): Promise<void>;
  read(id: string, extra?: Record<string, any>): Promise<void>;
  update(
    id: string,
    param: CustomerUpdate,
    extra?: Record<string, any>
  ): Promise<void>;
  remove(id: string, extra?: Record<string, any>): Promise<void>;
};

export function useCustomerHook(
  customerController: CustomerController
): CustomerHookType {
  const [state, setState] = useState<CustomerState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    param: CustomerList,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "list", status: "loading" });
      const data = await customerController.list(param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "list", status: "complete", error: error });
    }
  }

  async function create(
    param: CustomerCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "create", status: "loading" });
      await customerController.create(param, extra);
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
      const data = await customerController.read(id, extra);
      setState({ action: "read", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "read", status: "complete", error: error });
    }
  }

  async function update(
    id: string,
    param: CustomerUpdate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "update", status: "loading" });
      await customerController.update(id, param, extra);
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
      await customerController.remove(id, extra);
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
