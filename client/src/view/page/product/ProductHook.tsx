import { useState } from "react";
import { Result, State } from "../../../common/type";
import { ProductRepository } from "../../../feature/product/product_repository";
import {
  Product,
  ProductCreateParam,
  ProductListParam,
  ProductUpdateParam,
} from "../../../feature/product/product_type";

type ProductState = State<Result<Product | Product[]> | null | undefined>;

export type ProductHookType = {
  state: ProductState;
  list(param: ProductListParam, token: string): Promise<void>;
  create(param: ProductCreateParam, token: string): Promise<void>;
  read(id: string, token: string): Promise<void>;
  update(id: string, param: ProductUpdateParam, token: string): Promise<void>;
  remove(id: string, token: string): Promise<void>;
};

export function useProductHook(product: ProductRepository): ProductHookType {
  const [state, setState] = useState<ProductState>({
    action: "idle",
    status: "idle",
  });

  async function list(param: ProductListParam, token: string): Promise<void> {
    try {
      setState({ action: "list", status: "loading" });
      const data = await product.list(param, token);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ action: "list", status: "complete", error: error });
    }
  }

  async function create(
    param: ProductCreateParam,
    token: string
  ): Promise<void> {
    try {
      setState({ action: "create", status: "loading" });
      await product.create(param, token);
      setState({ action: "create", status: "complete" });
    } catch (error: any) {
      setState({ action: "create", status: "complete", error: error });
    }
  }

  async function read(id: string, token: string): Promise<void> {
    try {
      setState({ action: "read", status: "loading" });
      const data = await product.read(id, token);
      setState({ action: "read", status: "complete", data: data });
    } catch (error: any) {
      setState({ action: "read", status: "complete", error: error });
    }
  }

  async function update(
    id: string,
    param: ProductUpdateParam,
    token: string
  ): Promise<void> {
    try {
      setState({ action: "update", status: "loading" });
      await product.update(id, param, token);
      setState({ action: "update", status: "complete" });
    } catch (error: any) {
      setState({ action: "update", status: "complete", error: error });
    }
  }

  async function remove(id: string, token: string): Promise<void> {
    try {
      setState({ action: "remove", status: "loading" });
      await product.remove(id, token);
      setState({ action: "remove", status: "complete" });
    } catch (error: any) {
      setState({ action: "remove", status: "complete", error: error });
    }
  }

  return { state, list, create, read, update, remove };
}
