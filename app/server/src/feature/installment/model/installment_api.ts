import { Result } from "../../../common/type";
import { Installment } from "./installment_model";
import { InstallmentList, InstallmentCreate } from "./installment_types";

export interface InstallmentApi {
  list(
    invoiceId: string,
    param: InstallmentList
  ): Promise<Result<Installment[]>>;

  create(param: InstallmentCreate): Promise<void>;

  remove(id: string): Promise<void>;
}
