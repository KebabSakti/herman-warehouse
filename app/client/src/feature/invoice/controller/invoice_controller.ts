import { Result } from "../../../common/type";
import { InvoiceApi } from "../model/invoice_api";
import { Invoice } from "../model/invoice_model";
import { InvoiceCreate, InvoiceList } from "../model/invoice_type";

export class InvoiceController {
  invoiceApi: InvoiceApi;

  constructor(invoiceApi: InvoiceApi) {
    this.invoiceApi = invoiceApi;
  }

  async create(
    param: InvoiceCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    await this.invoiceApi.create(param, extra);
  }

  async read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Invoice | null | undefined> {
    const result = await this.invoiceApi.read(id, extra);

    return result;
  }

  async remove(id: string, extra?: Record<string, any>): Promise<void> {
    await this.invoiceApi.remove(id, extra);
  }

  async list(
    param: InvoiceList,
    extra?: Record<string, any>
  ): Promise<Result<Invoice[]>> {
    const result = await this.invoiceApi.list(param, extra);

    return result;
  }
}
