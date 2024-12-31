import { useState } from "react";
import { Result, State } from "../../../common/type";
import { StockController } from "../controller/stock_controller";
import { Stock } from "../model/stock_model";
import { StockCreate, StockList } from "../model/stock_type";

type StockState = State<Result<Stock[]> | Stock | null | undefined>;

export type StockHookType = {
  state: StockState;
  list(param: StockList, extra?: Record<string, any>): Promise<void>;
  create(param: StockCreate, extra?: Record<string, any>): Promise<void>;
  read(id: string, extra?: Record<string, any>): Promise<void>;
  remove(id: string, extra?: Record<string, any>): Promise<void>;
};

export function useStockHook(stockController: StockController): StockHookType {
  const [state, setState] = useState<StockState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    param: StockList,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "list", status: "loading" });
      const data = await stockController.list(param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "list", status: "complete", error: error });
    }
  }

  async function create(
    param: StockCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "create", status: "loading" });
      await stockController.create(param, extra);
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
      const data = await stockController.read(id, extra);
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
      await stockController.remove(id, extra);
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
