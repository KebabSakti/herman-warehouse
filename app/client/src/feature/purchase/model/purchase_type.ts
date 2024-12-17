import { array, InferType, number, object, string } from "yup";

export const purchaseCreateSchema = object({
  id: string().required("ID tidak boleh kosong"),
  supplierId: string().required("Supplier tidak boleh kosong"),
  fee: number().required("Fee tidak boleh kosong"),
  printed: string().required("Tanggal tidak boleh kosong"),
  note: string().nullable(),
  inventory: array(
    object({
      purchaseId: string().required(),
      productId: string().required(),
      qty: number().required(),
      price: number().required(),
    })
  )
    .min(1)
    .required("Harap tambahkan minimal 1 produk"),
  payment: array(
    object({
      purchaseId: string().required(),
      note: string().required(),
      amount: number().required(),
    })
  ).default([]),
});

export const purchaseUpdateSchema = purchaseCreateSchema;

export const purchaseListSchema = object({
  page: number().required(),
  limit: number().required(),
  search: string().nullable(),
  start: string().nullable(),
  end: string().nullable(),
});

export type PurchaseList = InferType<typeof purchaseListSchema>;
export type PurchaseCreate = InferType<typeof purchaseCreateSchema>;
export type PurchaseUpdate = InferType<typeof purchaseUpdateSchema>;
