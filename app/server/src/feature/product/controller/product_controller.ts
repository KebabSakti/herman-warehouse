import { Result } from "../../../common/type";
import { ProductApi } from "../model/product_api";
import {
    Product,
    ProductCreate,
    ProductList,
    ProductUpdate,
} from "../model/product_type";

export class ProductController {
  private productApi: ProductApi;

  constructor(productApi: ProductApi) {
    this.productApi = productApi;
  }

  async create(param: ProductCreate): Promise<void> {
    await this.productApi.create(param);
  }

  async read(id: string): Promise<Product | null | undefined> {
    const result = await this.productApi.read(id);

    return result;
  }

  async update(id: string, param: ProductUpdate): Promise<void> {
    await this.productApi.update(id, param);
  }

  async remove(id: string): Promise<void> {
    await this.productApi.delete(id);
  }

  async list(param: ProductList): Promise<Result<Product[]>> {
    const result = await this.productApi.list(param);

    return result;
  }
}
