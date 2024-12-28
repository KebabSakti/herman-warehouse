export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string | null | undefined;
  code: string;
  note?: string | null | undefined;
  total: number;
  item?: Item[] | null | undefined;
  installment?: Installment[] | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}

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

export interface Installment {
  id: string;
  invoiceId: string;
  amount: number;
  outstanding: number;
  note?: string | null | undefined;
  attachment?: string | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}
