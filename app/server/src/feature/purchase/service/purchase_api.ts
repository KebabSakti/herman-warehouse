import { Result } from "../../../common/type";
import {
    Purchase,
    PurchaseCreateParam,
    PurchaseListParam,
} from "../model/purchase_type";

export abstract class PurchaseApi {
  abstract purchaseList(param: PurchaseListParam): Promise<Result<Purchase[]>>;
  abstract purchaseCreate(param: PurchaseCreateParam): Promise<void>;
  abstract purchaseRead(
    id: string
  ): Promise<Result<Purchase> | null | undefined>;
}
