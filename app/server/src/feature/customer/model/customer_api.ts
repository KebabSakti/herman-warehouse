import { Result } from "../../../common/type";
import { Customer } from "./customer_model";
import { CustomerCreate, CustomerList, CustomerUpdate } from "./customer_type";

export interface CustomerApi {
  list(param: CustomerList): Promise<Result<Customer[]>>;
  create(param: CustomerCreate): Promise<void>;
  read(id: string): Promise<Customer | null | undefined>;
  update(id: string, param: CustomerUpdate): Promise<void>;
  remove(id: string): Promise<void>;
}
