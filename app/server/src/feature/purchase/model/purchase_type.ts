import { array, InferType, number, object, string } from "yup";

export const purchaseCreateSchema = object({
  id: string().required(),
  supplierId: string().required(),
  fee: number().required(),
  printed: string().required(),
  note: string().notRequired(),
  inventory: array(
    object({
      purchaseId: string().required(),
      productId: string().required(),
      qty: number().required(),
      price: number().required(),
    })
  )
    .min(1)
    .required(),
  payment: array(
    object({
      purchaseId: string().required(),
      note: string().required(),
      amount: number().required(),
    })
  ).default([]),
});

export const purchaseListSchema = object({
  page: number().required(),
  limit: number().required(),
  search: string().nullable(),
  start: string().nullable(),
  end: string().nullable(),
});

export type PurchaseList = InferType<typeof purchaseListSchema>;
export type PurchaseCreate = InferType<typeof purchaseCreateSchema>;
