import { CreditApi } from "../model/credit_api";
import { CreditList, CreditSummary } from "../model/credit_model";

export class CreditController {
  private creditApi: CreditApi;

  constructor(creditApi: CreditApi) {
    this.creditApi = creditApi;
  }

  async list(param: CreditList): Promise<CreditSummary> {
    const result = await this.creditApi.list(param);

    return result;
  }
}
