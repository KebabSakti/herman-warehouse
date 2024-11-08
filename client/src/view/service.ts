import { AuthRepository } from "../feature/auth/repository/auth_repository";
import { ProductRepository } from "../feature/product/product_repository";
import { AuthHookType, useAuthHook } from "./page/auth/AuthHook";
import { ProductHookType, useProductHook } from "./page/product/ProductHook";

export const authRepository = new AuthRepository();
export const productRepository = new ProductRepository();
