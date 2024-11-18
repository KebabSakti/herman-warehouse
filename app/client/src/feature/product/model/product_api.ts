import { Result } from "../../../common/type";
import {
  Product,
  ProductCreate,
  ProductList,
  ProductUpdate,
} from "./product_type";

export abstract class ProductApi {
  abstract create(
    param: ProductCreate,
    extra?: Record<string, any>
  ): Promise<void>;

  abstract read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Product | null | undefined>;

  abstract update(
    id: string,
    param: ProductUpdate,
    extra?: Record<string, any>
  ): Promise<void>;

  abstract delete(id: string, extra?: Record<string, any>): Promise<void>;

  abstract list(
    param: ProductList,
    extra?: Record<string, any>
  ): Promise<Result<Product[]>>;
}
