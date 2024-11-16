import { Result } from "../../../common/type";
import {
  Product,
  ProductCreate,
  ProductList,
  ProductUpdate,
} from "./product_type";

export abstract class ProductApi {
  abstract create(param: ProductCreate): Promise<void>;
  abstract read(id: string): Promise<Product | null | undefined>;
  abstract update(id: string, param: ProductUpdate): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract list(param: ProductList): Promise<Result<Product[]>>;
}
