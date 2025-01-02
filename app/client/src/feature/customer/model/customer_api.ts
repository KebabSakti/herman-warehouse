import { Result } from "../../../common/type";
import { Customer } from "./customer_model";
import { CustomerCreate, CustomerList, CustomerUpdate } from "./customer_type";

export interface CustomerApi {
  list(
    param: CustomerList,
    extra?: Record<string, any>
  ): Promise<Result<Customer[]>>;

  create(param: CustomerCreate, extra?: Record<string, any>): Promise<void>;

  read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Customer | null | undefined>;

  update(
    id: string,
    param: CustomerUpdate,
    extra?: Record<string, any>
  ): Promise<void>;

  remove(id: string, extra?: Record<string, any>): Promise<void>;
}
