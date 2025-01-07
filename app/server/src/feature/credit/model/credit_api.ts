import { Result } from "../../../common/type";
import { Customer } from "../../customer/model/customer_model";
import { CustomerList } from "../../customer/model/customer_type";

export interface CreditApi {
  list(param: CustomerList): Promise<Result<Customer[]>>;
  read(id: string): Promise<Customer | null | undefined>;
}
