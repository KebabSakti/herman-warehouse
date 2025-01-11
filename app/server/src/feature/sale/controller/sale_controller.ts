import { SaleApi } from "../model/sale_api";
import { SaleList, SaleSummary } from "../model/sale_model";

export class SaleController {
  private saleApi: SaleApi;

  constructor(SaleApi: SaleApi) {
    this.saleApi = SaleApi;
  }

  async list(param: SaleList): Promise<SaleSummary> {
    const result = await this.saleApi.list(param);

    return result;
  }
}
