import { ProfitList, ProfitSummary } from "./profit_model";

export interface ProfitApi {
  list(param: ProfitList, extra?: Record<string, any>): Promise<ProfitSummary>;
}
