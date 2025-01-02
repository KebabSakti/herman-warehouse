import { Result } from "../../../common/type";
import { CustomerApi } from "../model/customer_api";
import { Customer } from "../model/customer_model";
import {
    CustomerCreate,
    CustomerList,
    CustomerUpdate,
} from "../model/customer_type";

export class CustomerController {
  private customerApi: CustomerApi;

  constructor(CustomerApi: CustomerApi) {
    this.customerApi = CustomerApi;
  }

  async list(param: CustomerList): Promise<Result<Customer[]>> {
    const result = await this.customerApi.list(param);

    return result;
  }

  async create(param: CustomerCreate): Promise<void> {
    await this.customerApi.create(param);
  }

  async read(id: string): Promise<Customer | null | undefined> {
    const result = await this.customerApi.read(id);

    return result;
  }

  async update(id: string, param: CustomerUpdate): Promise<void> {
    await this.customerApi.update(id, param);
  }

  async remove(id: string): Promise<void> {
    await this.customerApi.remove(id);
  }
}
