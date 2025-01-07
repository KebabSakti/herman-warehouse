import { Failure } from "../../../common/error";
import { Result } from "../../../common/type";
import { ProductApi } from "../model/product_api";
import {
  Product,
  ProductCreate,
  ProductList,
  ProductUpdate,
} from "../model/product_type";

export class ProductController {
  productApi: ProductApi;

  constructor(productApi: ProductApi) {
    this.productApi = productApi;
  }

  async create(
    param: ProductCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    await this.productApi.create(param, extra);
  }

  async read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Product | null | undefined> {
    const result = await this.productApi.read(id, extra);

    return result;
  }

  async update(
    id: string,
    param: ProductUpdate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      await this.productApi.update(id, param, extra);
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async delete(id: string, extra?: Record<string, any>): Promise<void> {
    try {
      await this.productApi.delete(id, extra);
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async list(
    param: ProductList,
    extra?: Record<string, any>
  ): Promise<Result<Product[]>> {
    try {
      const result = await this.productApi.list(param, extra);

      return result;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }
}
