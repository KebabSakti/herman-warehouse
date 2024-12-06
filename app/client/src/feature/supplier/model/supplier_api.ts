import { Result } from "../../../common/type";
import { Supplier } from "./supplier_model";

export abstract class SupplierApi {
  abstract create(param: Supplier, extra?: Record<string, any>): Promise<void>;

  abstract read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Supplier | null | undefined>;

  abstract update(
    id: string,
    param: Supplier,
    extra?: Record<string, any>
  ): Promise<void>;

  abstract delete(id: string, extra?: Record<string, any>): Promise<void>;

  abstract list(
    param: Supplier,
    extra?: Record<string, any>
  ): Promise<Result<Supplier[]>>;
}
