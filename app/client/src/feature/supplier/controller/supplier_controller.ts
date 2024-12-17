import { Result } from "../../../common/type";
import { SupplierApi } from "../model/supplier_api";
import { Supplier } from "../model/supplier_model";
import {
  SupplierCreate,
  SupplierList,
  SupplierUpdate,
} from "../model/supplier_type";

export class SupplierController {
  api: SupplierApi;

  constructor(api: SupplierApi) {
    this.api = api;
  }

  async create(
    param: SupplierCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    await this.api.create(param, extra);
  }

  async read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Supplier | null | undefined> {
    const result = await this.api.read(id, extra);

    return result;
  }

  async update(
    id: string,
    param: SupplierUpdate,
    extra?: Record<string, any>
  ): Promise<void> {
    await this.api.update(id, param, extra);
  }

  async delete(id: string, extra?: Record<string, any>): Promise<void> {
    await this.api.delete(id, extra);
  }

  async list(
    param: SupplierList,
    extra?: Record<string, any>
  ): Promise<Result<Supplier[]>> {
    const result = await this.api.list(param, extra);

    return result;
  }
}
