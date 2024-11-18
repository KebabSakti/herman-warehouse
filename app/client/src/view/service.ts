import { AuthRepository } from "../feature/auth/repository/auth_repository";
// import { ProductRepository } from "../feature/product/product_repository";
import { PurchaseRepository } from "../feature/purchase/model/purchase_axios";
import { AuthHookType, useAuthHook } from "./page/auth/AuthHook";
import {
  ProductHookType,
  useProductHook,
} from "../feature/product/view/ProductHook";

export const authRepository = new AuthRepository();
// export const productRepository = new ProductRepository();
export const purchaseRepository = new PurchaseRepository();
