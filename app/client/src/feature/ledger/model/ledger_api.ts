import { Result } from "../../../common/type";
import { Ledger } from "./ledger_model";
import { LedgerList, LedgerCreate } from "./ledger_type";

export abstract class LedgerApi {
  abstract list(
    purchaseId: string,
    param?: LedgerList | null | undefined,
    extra?: Record<string, any>
  ): Promise<Result<Ledger[]>>;
  abstract create(
    param: LedgerCreate,
    extra?: Record<string, any>
  ): Promise<void>;
  abstract remove(id: string, extra?: Record<string, any>): Promise<void>;
}
