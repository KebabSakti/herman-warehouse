import { array, date, InferType, number, object, string } from "yup";
import { inventorySchema } from "./inventory_type";
import { paymentSchema } from "./payment_type";

export const purchaseSchema = object({
  id: string().required(),
  userId: string().required(),
  userName: string().required(),
  userPhone: string().required(),
  supplierId: string().required(),
  supplierName: string().required(),
  supplierPhone: string().required(),
  supplierAddress: string().nullable(),
  supplierNote: string().nullable(),
  code: string().required(),
  fee: number().required(),
  total: number().required(),
  paid: number().required(),
  other: number().required(),
  balance: number().required(),
  note: string().nullable(),
  due: date().nullable(),
  created: date().nullable(),
  updated: date().nullable(),
  deleted: date().nullable(),
  inventory: array(inventorySchema).optional(),
  payment: array(paymentSchema).optional(),
});

export const purchaseListSchema = object({
  page: string().required(),
  limit: string().required(),
  search: string().nullable(),
  start: string().required(),
  end: string().required(),
});

export type Purchase = InferType<typeof purchaseSchema>;
export type PurchaseListParam = InferType<typeof purchaseListSchema>;
