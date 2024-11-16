import axios from "axios";
import { server } from "../../common/common";
import { Failure } from "../../common/error";
import { Result } from "../../common/type";
import {
  Product,
  ProductCreateParam,
  ProductListParam,
  ProductUpdateParam,
} from "./product_type";

export class ProductRepository {
  async create(param: ProductCreateParam, token: string): Promise<void> {
    try {
      await axios.post(`${server}/app/product`, param, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async read(
    id: string,
    token: string
  ): Promise<Product | null | undefined> {
    try {
      const result = await axios.get(`${server}/app/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return result.data;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async update(
    id: string,
    param: ProductUpdateParam,
    token: string
  ): Promise<void> {
    try {
      await axios.put(`${server}/app/product/${id}`, param, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async remove(id: string, token: string): Promise<void> {
    try {
      await axios.delete(`${server}/app/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async list(
    param: ProductListParam,
    token: string
  ): Promise<Result<Product[]>> {
    try {
      const result = await axios.get(`${server}/app/product`, {
        params: param,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return result.data;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }
}
