import { useState } from "react";
import { State } from "../../../common/type";
import { ExpenseController } from "../controller/expense_controller";
import { Expense, ExpenseSummary } from "../model/expense_model";

type ExpenseState = State<ExpenseSummary | Expense | null | undefined>;

export type ExpenseHookType = {
  state: ExpenseState;
  list(param: Expense, extra?: Record<string, any>): Promise<void>;
  create(param: Expense, extra?: Record<string, any>): Promise<void>;
  read(id: string, extra?: Record<string, any>): Promise<void>;
  update(
    id: string,
    param: Expense,
    extra?: Record<string, any>
  ): Promise<void>;
  remove(id: string, extra?: Record<string, any>): Promise<void>;
};

export function useExpenseHook(
  expenseController: ExpenseController
): ExpenseHookType {
  const [state, setState] = useState<ExpenseState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    param: Expense,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "list", status: "loading" });
      const data = await expenseController.list(param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "list", status: "complete", error: error });
    }
  }

  async function create(
    param: Expense,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "create", status: "loading" });
      await expenseController.create(param, extra);
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
      const data = await expenseController.read(id, extra);
      setState({ action: "read", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "read", status: "complete", error: error });
    }
  }

  async function update(
    id: string,
    param: Expense,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "update", status: "loading" });
      await expenseController.update(id, param, extra);
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
      await expenseController.remove(id, extra);
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
