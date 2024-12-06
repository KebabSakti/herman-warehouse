export interface Purchase {
  id?: string | null | undefined;
  supplierId?: string | null | undefined;
  supplierName?: string | null | undefined;
  supplierPhone?: string | null | undefined;
  supplierAddress?: string | null | undefined;
  supplierNote: string | null | undefined;
  code?: string | null | undefined;
  fee?: number | null | undefined;
  margin?: number | null | undefined;
  total?: number | null | undefined;
  paid?: number | null | undefined;
  balance?: number | null | undefined;
  other?: number | null | undefined;
  note?: string | null | undefined;
  printed?: string | null | undefined;
  inventories?: Inventory[] | null | undefined;
  payments?: Payment[] | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}

export interface Inventory {
  id?: string | null | undefined;
  purchaseId?: string | null | undefined;
  productId?: string | null | undefined;
  productCode?: string | null | undefined;
  productName?: string | null | undefined;
  productNote?: string | null | undefined;
  qty?: number | null | undefined;
  price?: number | null | undefined;
  total?: number | null | undefined;
  keyword?: string | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}

export interface Payment {
  id?: string | null | undefined;
  purchaseId?: string | null | undefined;
  amount?: number | null | undefined;
  note?: string | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}

export interface SupplierReceiptTable {
  key: string;
  name: string;
  tag: SupplierReceiptTableTag;
  id?: string | null | undefined;
  qty?: string | null | undefined;
  price?: string | null | undefined;
  total?: string | null | undefined;
}

export enum SupplierReceiptTableTag {
  Product = "product",
  Payment = "payment",
  Fee = "fee",
  Total = "total",
  Note = "note",
}
