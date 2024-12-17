export interface Purchase {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierPhone: string;
  supplierAddress?: string | null | undefined;
  supplierNote?: string | null | undefined;
  code?: string | null | undefined;
  fee: number;
  margin: number;
  total: number;
  paid: number | null | undefined;
  balance: number;
  other: number;
  outstanding?: number | null | undefined;
  note?: string | null | undefined;
  due?: string | null | undefined;
  printed?: string | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
  inventory?: Inventory[] | null | undefined;
  payment?: Payment[] | null | undefined;
}

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

export interface Payment {
  id: string;
  purchaseId: string;
  amount: number;
  note: string;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}
