import { ProfitApi } from "../model/profit_api";
import { ProfitList, ProfitSummary } from "../model/profit_model";

export class ProfitController {
  private profitApi: ProfitApi;

  constructor(ProfitApi: ProfitApi) {
    this.profitApi = ProfitApi;
  }

  async list(param: ProfitList): Promise<ProfitSummary> {
    const result = await this.profitApi.list(param);

    return result;
  }
}
