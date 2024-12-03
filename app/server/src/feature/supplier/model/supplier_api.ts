import { Result } from "../../../common/type";
import {
  SupplierCreate,
  Supplier,
  SupplierUpdate,
  SupplierList,
} from "./supplier_type";

export abstract class SupplierApi {
  abstract create(param: SupplierCreate): Promise<void>;
  abstract read(id: string): Promise<Supplier | null | undefined>;
  abstract update(id: string, param: SupplierUpdate): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract list(param: SupplierList): Promise<Result<Supplier[]>>;
}
