import { Result } from "../../../common/type";
import { Purchase, PurchaseList } from "./purchase_type";

export abstract class PurchaseApi {
  abstract list(
    param: PurchaseList,
    extra?: Record<string, any>
  ): Promise<Result<Purchase[]>>;
}
