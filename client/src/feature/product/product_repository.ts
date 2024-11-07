import axios from "axios";
import { server } from "../../common/common";
import { Failure } from "../../common/error";
import { Result } from "../../common/type";
import { ProductModel } from "./product_type";

export class ProductRepository {
  async list(
    token: string,
    extra?: Record<string, any>
  ): Promise<Result<ProductModel[]>> {
    try {
      const response = await axios.get(`${server}`, {
        params: extra,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }
}
