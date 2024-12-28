import { Result } from "../../../common/type";
import { InvoiceApi } from "../model/invoice_api";
import { Invoice } from "../model/invoice_model";
import { InvoiceCreate, InvoiceList } from "../model/invoice_type";

export class InvoiceController {
  private invoiceApi: InvoiceApi;

  constructor(invoiceApi: InvoiceApi) {
    this.invoiceApi = invoiceApi;
  }

  async list(param: InvoiceList): Promise<Result<Invoice[]>> {
    const result = await this.invoiceApi.list(param);

    return result;
  }

  async create(param: InvoiceCreate): Promise<void> {
    await this.invoiceApi.create(param);
  }

  async read(id: string): Promise<Invoice | null | undefined> {
    const result = await this.invoiceApi.read(id);

    return result;
  }

  async remove(id: string): Promise<void> {
    await this.invoiceApi.remove(id);
  }
}
