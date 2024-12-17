import { Result } from "../../../common/type";
import { SupplierApi } from "../model/supplier_api";
import { Supplier } from "../model/supplier_model";
import {
  SupplierCreate,
  SupplierList,
  SupplierUpdate,
} from "../model/supplier_type";

export class SupplierController {
  private SupplierApi: SupplierApi;

  constructor(SupplierApi: SupplierApi) {
    this.SupplierApi = SupplierApi;
  }

  async create(param: SupplierCreate): Promise<void> {
    await this.SupplierApi.create(param);
  }

  async read(id: string): Promise<Supplier | null | undefined> {
    const result = await this.SupplierApi.read(id);

    return result;
  }

  async update(id: string, param: SupplierUpdate): Promise<void> {
    await this.SupplierApi.update(id, param);
  }

  async remove(id: string): Promise<void> {
    await this.SupplierApi.delete(id);
  }

  async list(param: SupplierList): Promise<Result<Supplier[]>> {
    const result = await this.SupplierApi.list(param);

    return result;
  }
}
