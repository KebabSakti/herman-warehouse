import { Result } from "../../../common/type";
import { LedgerApi } from "../model/ledger_api";
import { Ledger } from "../model/ledger_model";
import { LedgerList, LedgerCreate } from "../model/ledger_type";

export class LedgerController {
  private ledgerApi: LedgerApi;

  constructor(LedgerApi: LedgerApi) {
    this.ledgerApi = LedgerApi;
  }

  async list(purchaseId: string, param: LedgerList): Promise<Result<Ledger[]>> {
    const result = await this.ledgerApi.list(purchaseId, param);

    return result;
  }

  async create(param: LedgerCreate): Promise<void> {
    await this.ledgerApi.create(param);
  }

  async remove(id: string): Promise<void> {
    await this.ledgerApi.remove(id);
  }
}
