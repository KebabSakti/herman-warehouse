import { useState } from "react";
import { Result, State } from "../../../common/type";
import { ProductController } from "../controller/product_controller";
import {
  Product,
  ProductCreate,
  ProductList,
  ProductUpdate,
} from "../model/product_type";

type ProductState = State<Result<Product[]> | Product | null | undefined>;

export type ProductHookType = {
  state: ProductState;
  list(param: ProductList, extra?: Record<string, any>): Promise<void>;
  create(param: ProductCreate, extra?: Record<string, any>): Promise<void>;
  read(id: string, extra?: Record<string, any>): Promise<void>;
  update(
    id: string,
    param: ProductUpdate,
    extra?: Record<string, any>
  ): Promise<void>;
  remove(id: string, extra?: Record<string, any>): Promise<void>;
};

export function useProductHook(
  productController: ProductController
): ProductHookType {
  const [state, setState] = useState<ProductState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    param: ProductList,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ action: "list", status: "loading" });
      const data = await productController.list(param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ action: "list", status: "complete", error: error });
    }
  }

  async function create(
    param: ProductCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ action: "create", status: "loading" });
      await productController.create(param, extra);
      setState({ action: "create", status: "complete" });
    } catch (error: any) {
      setState({ action: "create", status: "complete", error: error });
    }
  }

  async function read(id: string, extra?: Record<string, any>): Promise<void> {
    try {
      setState({ action: "read", status: "loading" });
      const data = await productController.read(id, extra);
      setState({ action: "read", status: "complete", data: data });
    } catch (error: any) {
      setState({ action: "read", status: "complete", error: error });
    }
  }

  async function update(
    id: string,
    param: ProductUpdate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ action: "update", status: "loading" });
      await productController.update(id, param, extra);
      setState({ action: "update", status: "complete" });
    } catch (error: any) {
      setState({ action: "update", status: "complete", error: error });
    }
  }

  async function remove(
    id: string,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ action: "remove", status: "loading" });
      await productController.delete(id, extra);
      setState({ action: "remove", status: "complete" });
    } catch (error: any) {
      setState({ action: "remove", status: "complete", error: error });
    }
  }

  return { state, list, create, read, update, remove };
}
