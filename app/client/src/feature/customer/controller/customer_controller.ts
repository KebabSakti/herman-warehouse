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

  async list(
    param: CustomerList,
    extra?: Record<string, any>
  ): Promise<Result<Customer[]>> {
    const result = await this.customerApi.list(param, extra);

    return result;
  }

  async create(
    param: CustomerCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    await this.customerApi.create(param, extra);
  }

  async read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Customer | null | undefined> {
    const result = await this.customerApi.read(id, extra);

    return result;
  }

  async update(
    id: string,
    param: CustomerUpdate,
    extra?: Record<string, any>
  ): Promise<void> {
    await this.customerApi.update(id, param, extra);
  }

  async remove(id: string, extra?: Record<string, any>): Promise<void> {
    await this.customerApi.remove(id, extra);
  }
}
