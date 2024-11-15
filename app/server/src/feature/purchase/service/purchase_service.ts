import { Result } from "../../../common/type";
import {
  Purchase,
  PurchaseCreateParam,
  PurchaseListParam,
} from "../model/purchase_type";
import { PurchaseApi } from "./purchase_api";

export class PurchaseService {
  private purchaseApi: PurchaseApi;

  constructor(purchaseApi: PurchaseApi) {
    this.purchaseApi = purchaseApi;
  }

  async purchaseList(param: PurchaseListParam): Promise<Result<Purchase[]>> {
    const result = await this.purchaseApi.purchaseList(param);

    return result;
  }

  async purchaseCreate(param: PurchaseCreateParam): Promise<void> {
    await this.purchaseApi.purchaseCreate(param);
  }

  async purchaseRead(id: string): Promise<Result<Purchase> | null | undefined> {
    const result = await this.purchaseApi.purchaseRead(id);

    return result;
  }
}
