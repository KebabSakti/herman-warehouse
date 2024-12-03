import { date, InferType, number, object, string } from "yup";

export const supplierSchema = object({
  id: string().required(),
  name: string().required(),
  phone: string().nullable(),
  address: string().nullable(),
  created: date().nullable(),
  updated: date().nullable(),
  deleted: date().nullable(),
});

export const supplierCreateSchema = object({
  id: string().required(),
  name: string().required(),
  phone: string().nullable(),
  address: string().nullable(),
});

export const supplierUpdateSchema = object({
  name: string().required(),
  phone: string().nullable(),
  address: string().nullable(),
});

export const supplierListSchema = object({
  page: number().required(),
  limit: number().required(),
  search: string().nullable(),
});

export type Supplier = InferType<typeof supplierSchema>;
export type SupplierCreate = InferType<typeof supplierCreateSchema>;
export type SupplierUpdate = InferType<typeof supplierUpdateSchema>;
export type SupplierList = InferType<typeof supplierListSchema>;
