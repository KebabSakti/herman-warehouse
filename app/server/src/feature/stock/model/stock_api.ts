import { Result } from "../../../common/type";
import { Stock } from "./stock_model";
import { StockCreate, StockList } from "./stock_type";

export interface StockApi {
  list(param: StockList): Promise<Result<Stock[]>>;
  create(param: StockCreate): Promise<void>;
  read(id: string): Promise<Stock | null | undefined>;
  remove(id: string): Promise<void>;
}
