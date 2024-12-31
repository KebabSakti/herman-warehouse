import { Result } from "../../../common/type";
import { StockApi } from "../model/stock_api";
import { Stock } from "../model/stock_model";
import { StockList, StockCreate } from "../model/stock_type";

export class StockController {
  private stockApi: StockApi;

  constructor(StockApi: StockApi) {
    this.stockApi = StockApi;
  }

  async list(param: StockList): Promise<Result<Stock[]>> {
    const result = await this.stockApi.list(param);

    return result;
  }

  async create(param: StockCreate): Promise<void> {
    await this.stockApi.create(param);
  }

  async read(id: string): Promise<Stock | null | undefined> {
    const result = await this.stockApi.read(id);

    return result;
  }

  async remove(id: string): Promise<void> {
    await this.stockApi.remove(id);
  }
}
