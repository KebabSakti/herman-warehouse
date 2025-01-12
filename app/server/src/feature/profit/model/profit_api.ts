import { ProfitList, ProfitSummary } from "./profit_model";

export interface ProfitApi {
  list(param: ProfitList): Promise<ProfitSummary>;
}
