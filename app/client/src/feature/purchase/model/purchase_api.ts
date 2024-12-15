import { Result } from "../../../common/type";
import { Purchase } from "./purchase_model";
import { PurchaseCreate, PurchaseList, PurchaseUpdate } from "./purchase_type";

export abstract class PurchaseApi {
  abstract create(
    param: PurchaseCreate,
    extra?: Record<string, any>
  ): Promise<void>;

  abstract read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Purchase | null | undefined>;

  abstract update(
    id: string,
    param: PurchaseUpdate,
    extra?: Record<string, any>
  ): Promise<void>;

  abstract delete(id: string, extra?: Record<string, any>): Promise<void>;

  abstract list(
    param: PurchaseList,
    extra?: Record<string, any>
  ): Promise<Result<Purchase[]>>;
}
