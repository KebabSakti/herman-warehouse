import { Result } from "../../../common/type";
import { Purchase, PurchaseCreate, PurchaseList } from "../model/purchase_type";

export abstract class PurchaseApi {
  abstract list(param: PurchaseList): Promise<Result<Purchase[]>>;
  abstract create(param: PurchaseCreate): Promise<void>;
  abstract read(id: string): Promise<Purchase | null | undefined>;
}
