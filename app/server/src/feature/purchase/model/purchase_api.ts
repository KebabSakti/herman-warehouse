import { Result } from "../../../common/type";
import { Purchase } from "./purchase_model";
import { PurchaseCreate, PurchaseList, PurchaseUpdate } from "./purchase_type";

export abstract class PurchaseApi {
  abstract list(param: PurchaseList): Promise<Result<Purchase[]>>;
  abstract create(param: PurchaseCreate): Promise<void>;
  abstract read(id: string): Promise<Purchase | null | undefined>;
  abstract update(id: string, param: PurchaseUpdate): Promise<void>;
  abstract remove(id: string): Promise<void>;
  abstract findBySupplierId(
    id: string,
    param?: Record<string, any> | null | undefined
  ): Promise<Result<Purchase[]>>;
}
