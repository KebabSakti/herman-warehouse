import { Result } from "../../../common/type";
import { Purchase } from "./purchase_model";

export abstract class PurchaseApi {
  abstract list(
    param: Purchase,
    extra?: Record<string, any>
  ): Promise<Result<Purchase[]>>;
}
