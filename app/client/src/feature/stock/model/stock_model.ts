import { Product } from "../../product/model/product_type";
import { Supplier } from "../../supplier/model/supplier_model";

export interface Stock {
  id: string;
  supplierId: string;
  productId: string;
  qty: number;
  price: number;
  product: Product;
  supplier: Supplier;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}
