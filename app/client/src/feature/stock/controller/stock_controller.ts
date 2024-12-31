import { Result } from "../../../common/type";
import { StockApi } from "../model/stock_api";
import { Stock } from "../model/stock_model";
import { StockCreate, StockList } from "../model/stock_type";

export class StockController {
  stockApi: StockApi;

  constructor(stockApi: StockApi) {
    this.stockApi = stockApi;
  }

  async create(param: StockCreate, extra?: Record<string, any>): Promise<void> {
    await this.stockApi.create(param, extra);
  }

  async read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Stock | null | undefined> {
    const result = await this.stockApi.read(id, extra);

    return result;
  }

  async remove(id: string, extra?: Record<string, any>): Promise<void> {
    await this.stockApi.remove(id, extra);
  }

  async list(
    param: StockList,
    extra?: Record<string, any>
  ): Promise<Result<Stock[]>> {
    const result = await this.stockApi.list(param, extra);

    return result;
  }
}
