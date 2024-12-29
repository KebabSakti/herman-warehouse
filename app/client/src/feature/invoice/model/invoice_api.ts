import { Result } from "../../../common/type";
import { Invoice } from "./invoice_model";
import { InvoiceCreate, InvoiceList } from "./invoice_type";

export interface InvoiceApi {
  list(
    param: InvoiceList,
    extra?: Record<string, any>
  ): Promise<Result<Invoice[]>>;

  create(param: InvoiceCreate, extra?: Record<string, any>): Promise<void>;

  read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Invoice | null | undefined>;

  remove(id: string, extra?: Record<string, any>): Promise<void>;
}
