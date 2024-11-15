import { date, InferType, number, object, string } from "yup";

export const stockSchema = object({
  id: string().required(),
  supplierId: string().required(),
  productId: string().required(),
  price: number().required(),
  created: date().nullable(),
  updated: date().nullable(),
  deleted: date().nullable(),
});

export type Stock = InferType<typeof stockSchema>;
