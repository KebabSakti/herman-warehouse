import { Result } from "../../common/type";
import { PurchaseApi } from "./purchase_api";
import { PurchaseModel } from "./purchase_type";

export class PurhcaseMysql implements PurchaseApi {
  async list(extra?: Map<string, any>): Promise<Result<PurchaseModel[]>> {
    throw new Error("Method not implemented.");
  }
}
