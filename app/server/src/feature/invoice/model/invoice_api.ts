import { Result } from "../../../common/type";
import { Invoice } from "./invoice_model";
import { InvoiceCreate, InvoiceList } from "./invoice_type";

export interface InvoiceApi {
  list(param: InvoiceList): Promise<Result<Invoice[]>>;
  create(param: InvoiceCreate): Promise<void>;
  read(id: string): Promise<Invoice | null | undefined>;
  remove(id: string): Promise<void>;
}
