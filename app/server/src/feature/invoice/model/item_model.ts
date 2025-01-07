export interface Item {
  id: string;
  invoiceId: string;
  stockId: string;
  productId: string;
  productCode: string;
  productName: string;
  productNote?: string | null | undefined;
  supplierId: string;
  supplierName: string;
  supplierPhone: string;
  qty: number;
  price: number;
  total: number;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}
