import { Result } from "../../../common/type";
import { Stock } from "./stock_model";
import { StockCreate, StockList } from "./stock_type";

export interface StockApi {
  list(param: StockList, extra?: Record<string, any>): Promise<Result<Stock[]>>;
  create(param: StockCreate, extra?: Record<string, any>): Promise<void>;
  read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Stock | null | undefined>;
  remove(id: string, extra?: Record<string, any>): Promise<void>;
}
