import { date, InferType, number, object, string } from "yup";

export const inventorySchema = object({
  id: string().required(),
  purchaseId: string().required(),
  productId: string().required(),
  productCode: string().required(),
  productName: string().required(),
  productNote: string().nullable(),
  qty: number().required(),
  price: number().required(),
  total: number().required(),
  keyword: string().nullable(),
  created: date().nullable(),
  updated: date().nullable(),
  deleted: date().nullable(),
});

export type Inventory = InferType<typeof inventorySchema>;
