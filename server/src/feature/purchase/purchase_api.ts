import { Result } from "../../common/type";
import { PurchaseModel } from "./purchase_type";

export abstract class PurchaseApi {
  abstract list(extra?: Map<string, any>): Promise<Result<PurchaseModel[]>>;
}
