export interface Inventory {
  id: string;
  purchaseId: string;
  productId: string;
  productCode: string;
  productName: string;
  productNote?: string | null | undefined;
  qty: number;
  price: number;
  total: number;
  keyword?: string | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}
