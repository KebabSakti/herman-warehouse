import { CreditList, CreditSummary } from "./credit_model";

export interface CreditApi {
  list(param: CreditList, extra?: Record<string, any>): Promise<CreditSummary>;
}
