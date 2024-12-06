import { Result } from "../../../common/type";
import { PurchaseApi } from "../model/purchase_api";
import { Purchase } from "../model/purchase_model";

export class PurchaseController {
  purchaseApi: PurchaseApi;

  constructor(purchaseApi: PurchaseApi) {
    this.purchaseApi = purchaseApi;
  }

  async list(
    param: Purchase,
    extra?: Record<string, any>
  ): Promise<Result<Purchase[]>> {
    const result = await this.purchaseApi.list(param, extra);

    return result;
  }
}
