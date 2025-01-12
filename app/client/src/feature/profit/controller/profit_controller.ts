import { ProfitApi } from "../model/profit_api";
import { ProfitList, ProfitSummary } from "../model/profit_model";

export class ProfitController {
  private profitApi: ProfitApi;

  constructor(profitApi: ProfitApi) {
    this.profitApi = profitApi;
  }

  async list(
    param: ProfitList,
    extra?: Record<string, any>
  ): Promise<ProfitSummary> {
    const result = await this.profitApi.list(param, extra);

    return result;
  }
}
