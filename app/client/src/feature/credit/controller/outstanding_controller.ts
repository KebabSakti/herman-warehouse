import { OutstandingApi } from "../model/credit_api";
import { OutstandingList, OutstandingSummary } from "../model/credit_model";

export class OutstandingController {
  private outstandingApi: OutstandingApi;

  constructor(OutstandingApi: OutstandingApi) {
    this.outstandingApi = OutstandingApi;
  }

  async list(
    param: OutstandingList,
    extra?: Record<string, any>
  ): Promise<OutstandingSummary> {
    const result = await this.outstandingApi.list(param, extra);

    return result;
  }
}
