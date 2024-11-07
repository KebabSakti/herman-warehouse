import { Result } from "../../common/type";
import { ProductModel } from "./product_type";

export abstract class ProductApi {
  abstract list(extra?: Map<string, any>): Promise<Result<ProductModel[]>>;
}
