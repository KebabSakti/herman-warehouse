import { array, date, InferType, number, object, string } from "yup";

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

export const inventoryCreateSchema = object({
  id: string().required(),
  productId: string().required(),
  productName: string().required(),
  qty: number().required(),
  price: number().required(),
  total: number().required(),
});

export const paymentSchema = object({
  id: string().required(),
  purchaseId: string().required(),
  amount: number().required(),
  note: string().required(),
  created: date().nullable(),
  updated: date().nullable(),
  deleted: date().nullable(),
});

export const paymentCreateSchema = object({
  id: string().required(),
  amount: number().required(),
  note: string().required(),
});

export const stockSchema = object({
  id: string().required(),
  supplierId: string().required(),
  productId: string().required(),
  price: number().required(),
  created: date().nullable(),
  updated: date().nullable(),
  deleted: date().nullable(),
});

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
  balance: number().required(),
  other: number().required(),
  note: string().nullable(),
  due: date().nullable(),
  created: date().nullable(),
  updated: date().nullable(),
  deleted: date().nullable(),
  inventory: array(inventorySchema).optional(),
  payment: array(paymentSchema).optional(),
});

export const purchaseCreateSchema = object({
  supplierId: string().required(),
  supplierName: string().required(),
  fee: number().required(),
  paid: number().required(),
  total: number().required(),
  balance: number().required(),
  other: number().required(),
  note: string().nullable(),
  due: string().nullable(),
  inventory: array(inventoryCreateSchema).min(1).required(),
  payment: array(paymentCreateSchema).default([]),
});

export const purchaseUpdateSchema = object({
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
  paid: number().required(),
  total: number().required(),
  balance: number().required(),
  other: number().required(),
  note: string().nullable(),
  due: date().nullable(),
  inventory: array(inventoryCreateSchema).min(1).required(),
  payment: array(paymentCreateSchema).optional(),
});

export const purchaseListSchema = object({
  page: number().required(),
  limit: number().required(),
  search: string().nullable(),
  start: string().required(),
  end: string().required(),
});

export type Purchase = InferType<typeof purchaseSchema>;
export type PurchaseList = InferType<typeof purchaseListSchema>;
export type PurchaseCreate = InferType<typeof purchaseCreateSchema>;
export type Inventory = InferType<typeof inventorySchema>;
export type InventoryCreate = InferType<typeof inventoryCreateSchema>;
export type Payment = InferType<typeof paymentSchema>;
export type PaymentCreate = InferType<typeof paymentCreateSchema>;
export type Stock = InferType<typeof stockSchema>;
