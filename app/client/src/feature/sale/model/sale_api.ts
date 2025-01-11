import { SaleList, SaleSummary } from "./sale_model";

export interface SaleApi {
  list(param: SaleList, extra?: Record<string, any>): Promise<SaleSummary>;
}
