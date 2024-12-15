import { Result } from "../../../common/type";
import { PurchaseApi } from "../model/purchase_api";
import { Purchase } from "../model/purchase_model";
import {
  PurchaseCreate,
  PurchaseList,
  PurchaseUpdate,
} from "../model/purchase_type";

export class PurchaseController {
  purchaseApi: PurchaseApi;

  constructor(purchaseApi: PurchaseApi) {
    this.purchaseApi = purchaseApi;
  }

  async create(
    param: PurchaseCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    await this.purchaseApi.create(param, extra);
  }

  async read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Purchase | null | undefined> {
    const result = await this.purchaseApi.read(id, extra);

    return result;
  }

  async update(
    id: string,
    param: PurchaseUpdate,
    extra?: Record<string, any>
  ): Promise<void> {
    await this.purchaseApi.update(id, param, extra);
  }

  async delete(id: string, extra?: Record<string, any>): Promise<void> {
    await this.purchaseApi.delete(id, extra);
  }

  async list(
    param: PurchaseList,
    extra?: Record<string, any>
  ): Promise<Result<Purchase[]>> {
    const result = await this.purchaseApi.list(param, extra);

    return result;
  }
}
