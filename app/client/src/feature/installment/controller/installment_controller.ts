import { Result } from "../../../common/type";
import { InstallmentApi } from "../model/installment_api";
import { Installment } from "../model/installment_model";
import { InstallmentCreate, InstallmentList } from "../model/installment_types";

export class InstallmentController {
  installmentApi: InstallmentApi;

  constructor(installmentApi: InstallmentApi) {
    this.installmentApi = installmentApi;
  }

  async create(
    param: InstallmentCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    await this.installmentApi.create(param, extra);
  }

  async remove(id: string, extra?: Record<string, any>): Promise<void> {
    await this.installmentApi.remove(id, extra);
  }

  async list(
    invoiceId: string,
    param?: InstallmentList | null | undefined,
    extra?: Record<string, any>
  ): Promise<Result<Installment[]>> {
    const result = await this.installmentApi.list(invoiceId, param, extra);

    return result;
  }
}
