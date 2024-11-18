import { Result } from "../../../common/type";
import { PurchaseApi } from "../model/purchase_api";
import { Purchase, PurchaseList } from "../model/purchase_type";

export class PurchaseController {
  purchaseApi: PurchaseApi;

  constructor(purchaseApi: PurchaseApi) {
    this.purchaseApi = purchaseApi;
  }

  async list(
    param: PurchaseList,
    extra?: Record<string, any>
  ): Promise<Result<Purchase[]>> {
    const result = await this.purchaseApi.list(param, extra);

    return result;
  }
}
