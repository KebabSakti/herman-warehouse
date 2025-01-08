import { Result } from "../../../common/type";
import { Installment } from "./installment_model";
import { InstallmentCreate, InstallmentList } from "./installment_types";

export interface InstallmentApi {
  list(
    invoiceId: string,
    param?: InstallmentList|null|undefined,
    extra?: Record<string, any>
  ): Promise<Result<Installment[]>>;

  create(param: InstallmentCreate, extra?: Record<string, any>): Promise<void>;

  remove(id: string, extra?: Record<string, any>): Promise<void>;
}
