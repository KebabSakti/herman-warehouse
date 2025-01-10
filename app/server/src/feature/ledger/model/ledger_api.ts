import { Result } from "../../../common/type";
import { Ledger } from "./ledger_model";
import { LedgerList, LedgerCreate } from "./ledger_type";

export abstract class LedgerApi {
  abstract list(
    purchaseId: string,
    param: LedgerList
  ): Promise<Result<Ledger[]>>;
  abstract create(param: LedgerCreate): Promise<void>;
  abstract remove(id: string): Promise<void>;
}
