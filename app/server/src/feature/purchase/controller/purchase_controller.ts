import { Result } from "../../../common/type";
import { PurchaseApi } from "../model/purchase_api";
import { Purchase } from "../model/purchase_model";
import { PurchaseCreate, PurchaseList } from "../model/purchase_type";

export class PurchaseController {
  private purchaseApi: PurchaseApi;

  constructor(purchaseApi: PurchaseApi) {
    this.purchaseApi = purchaseApi;
  }

  async list(param: PurchaseList): Promise<Result<Purchase[]>> {
    const result = await this.purchaseApi.list(param);

    return result;
  }

  async create(param: PurchaseCreate): Promise<void> {
    await this.purchaseApi.create(param);
  }

  async read(id: string): Promise<Purchase | null | undefined> {
    const result = await this.purchaseApi.read(id);

    return result;
  }

  async remove(id: string): Promise<void> {
    await this.purchaseApi.remove(id);
  }
}
