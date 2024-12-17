import { Result } from "../../../common/type";
import { Supplier } from "./supplier_model";
import { SupplierCreate, SupplierList, SupplierUpdate } from "./supplier_type";

export abstract class SupplierApi {
  abstract create(
    param: SupplierCreate,
    extra?: Record<string, any>
  ): Promise<void>;

  abstract read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Supplier | null | undefined>;

  abstract update(
    id: string,
    param: SupplierUpdate,
    extra?: Record<string, any>
  ): Promise<void>;

  abstract delete(id: string, extra?: Record<string, any>): Promise<void>;

  abstract list(
    param: SupplierList,
    extra?: Record<string, any>
  ): Promise<Result<Supplier[]>>;
}
