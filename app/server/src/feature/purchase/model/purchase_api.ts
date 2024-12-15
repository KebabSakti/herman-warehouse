import { Result } from "../../../common/type";
import { Purchase } from "./purchase_model";
import { PurchaseCreate, PurchaseList } from "./purchase_type";

export abstract class PurchaseApi {
  abstract list(param: PurchaseList): Promise<Result<Purchase[]>>;
  abstract create(param: PurchaseCreate): Promise<void>;
  abstract read(id: string): Promise<Purchase | null | undefined>;
}
