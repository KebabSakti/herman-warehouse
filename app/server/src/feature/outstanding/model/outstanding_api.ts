import { OutstandingList, OutstandingSummary } from "./outstanding_model";

export interface OutstandingApi {
  list(param: OutstandingList): Promise<OutstandingSummary>;
}
