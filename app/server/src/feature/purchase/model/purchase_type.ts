import { array, InferType, number, object, string } from "yup";

export const purchaseCreateSchema = object({
  id: string().required("ID tidak boleh kosong"),
  supplierId: string().required("Supplier tidak boleh kosong"),
  supplierName: string().required(),
  supplierPhone: string().required(),
  supplierAddress: string().nullable(),
  supplierNote: string().nullable(),
  code: string().nullable(),
  fee: number().required("Fee tidak boleh kosong"),
  margin: number().required(),
  totalItem: number().required(),
  dp: number().required(),
  other: number().required(),
  outstanding: number().required(),
  total: number().required(),
  balance: number().required(),
  note: string().nullable(),
  printed: string().required("Tanggal tidak boleh kosong"),
  inventory: array(
    object({
      id: string().required(),
      purchaseId: string().required(),
      productId: string().required(),
      productCode: string().required(),
      productName: string().required(),
      productNote: string().nullable(),
      qty: number().required(),
      price: number().required(),
      total: number().required(),
    })
  )
    .min(1)
    .required("Harap tambahkan minimal 1 produk"),
  payment: array(
    object({
      id: string().required(),
      purchaseId: string().required(),
      amount: number().required(),
      note: string().required(),
    })
  ).nullable(),
  ledger: object({
    id: string().required(),
    purchaseId: string().required(),
    supplierId: string().required(),
    amount: number().required(),
    file: string().nullable(),
    note: string().nullable(),
  }).nullable(),
});

export const purchaseListSchema = object({
  page: number().required(),
  limit: number().required(),
  search: string().nullable(),
  start: string().nullable(),
  end: string().nullable(),
  supplierId: string().nullable(),
});

export type PurchaseList = InferType<typeof purchaseListSchema>;
export type PurchaseCreate = InferType<typeof purchaseCreateSchema>;
export type PurchaseUpdate = InferType<typeof purchaseCreateSchema>;
