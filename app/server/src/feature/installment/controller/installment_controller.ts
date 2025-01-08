import { Result } from "../../../common/type";
import { InstallmentApi } from "../model/installment_api";
import { Installment } from "../model/installment_model";
import { InstallmentCreate, InstallmentList } from "../model/installment_types";

export class InstallmentController {
  installmentApi: InstallmentApi;

  constructor(installmentApi: InstallmentApi) {
    this.installmentApi = installmentApi;
  }

  async create(param: InstallmentCreate): Promise<void> {
    await this.installmentApi.create(param);
  }

  async remove(id: string): Promise<void> {
    await this.installmentApi.remove(id);
  }

  async list(
    invoiceId: string,
    param: InstallmentList
  ): Promise<Result<Installment[]>> {
    const result = await this.installmentApi.list(invoiceId, param);

    return result;
  }
}
