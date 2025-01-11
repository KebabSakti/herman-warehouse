import { array, boolean, InferType, mixed, number, object, string } from "yup";

export const purchaseCreateSchema = object({
  id: string().required("ID tidak boleh kosong"),
  supplierId: string().required("Supplier tidak boleh kosong"),
  supplierName: string().required("Supplier tidak boleh kosong"),
  supplierPhone: string().nullable(),
  supplierAddress: string().nullable(),
  supplierNote: string().nullable(),
  code: string().required(),
  fee: number().required("Fee tidak boleh kosong"),
  margin: number().required(),
  totalItem: number().required(),
  dp: number().nullable(),
  other: number().nullable(),
  outstanding: number().nullable(),
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
  ledger: array(
    object({
      id: string().required(),
      purchaseId: string().nullable(),
      supplierId: string().nullable(),
      amount: number().required("Jumlah tidak boleh kosong"),
      outstanding: number().nullable(),
      file: mixed().nullable(),
      note: string().nullable(),
      printed: string().nullable(),
      dp: boolean().nullable(),
    })
  ).nullable(),
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
