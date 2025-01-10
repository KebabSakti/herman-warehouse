import { Result } from "../../../common/type";
import { LedgerApi } from "../model/ledger_api";
import { Ledger } from "../model/ledger_model";
import { LedgerList, LedgerCreate } from "../model/ledger_type";

export class LedgerController {
  private ledgerApi: LedgerApi;

  constructor(LedgerApi: LedgerApi) {
    this.ledgerApi = LedgerApi;
  }

  async list(
    purchaseId: string,
    param?: LedgerList | null | undefined,
    extra?: Record<string, any>
  ): Promise<Result<Ledger[]>> {
    const result = await this.ledgerApi.list(purchaseId, param, extra);

    return result;
  }

  async create(
    param: LedgerCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    await this.ledgerApi.create(param, extra);
  }

  async remove(id: string, extra?: Record<string, any>): Promise<void> {
    await this.ledgerApi.remove(id, extra);
  }
}
