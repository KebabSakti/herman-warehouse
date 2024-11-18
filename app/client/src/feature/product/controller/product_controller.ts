import { ProductApi } from "../model/product_api";
import { ProductCreate } from "../model/product_type";

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
      await axios({
        url: `${server}/app/product/${id}`,
        method: "put",
        data: param,
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async delete(id: string, extra?: Record<string, any>): Promise<void> {
    try {
      await axios({
        url: `${server}/app/product/${id}`,
        method: "delete",
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async list(
    param: ProductList,
    extra?: Record<string, any>
  ): Promise<Result<Product[]>> {
    try {
      const result = await axios({
        url: `${server}/app/product`,
        method: "get",
        params: param,
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
        },
      });

      return result.data;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }
}
