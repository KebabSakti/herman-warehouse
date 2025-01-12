import { CreditApi } from "../model/credit_api";
import { CreditList, CreditSummary } from "../model/credit_model";

export class CreditController {
  private creditApi: CreditApi;

  constructor(CreditApi: CreditApi) {
    this.creditApi = CreditApi;
  }

  async list(param: CreditList): Promise<CreditSummary> {
    const result = await this.creditApi.list(param);

    return result;
  }
}
