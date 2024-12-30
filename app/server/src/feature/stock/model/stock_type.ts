import { InferType, number, object, string } from "yup";

export const stockCreateSchema = object({
  id: string().required(),
  supplierId: string().required(),
  productId: string().required(),
  qty: number().required(),
  price: number().required(),
  created: string().nullable(),
  updated: string().nullable(),
});

export const stockListSchema = object({
  page: number().required(),
  limit: number().required(),
  search: string().nullable(),
});

export type StockList = InferType<typeof stockListSchema>;
export type StockCreate = InferType<typeof stockCreateSchema>;
