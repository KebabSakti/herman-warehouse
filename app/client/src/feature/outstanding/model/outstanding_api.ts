import { OutstandingList, OutstandingSummary } from "./outstanding_model";

export interface OutstandingApi {
  list(
    param: OutstandingList,
    extra?: Record<string, any>
  ): Promise<OutstandingSummary>;
}
