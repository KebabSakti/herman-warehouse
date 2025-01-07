import { InferType, number, object, string } from "yup";

export const supplierCreateSchema = object({
  id: string().required(),
  name: string().required(),
  phone: string().nullable(),
  address: string().nullable(),
  note: string().nullable(),
});

export const supplierUpdateSchema = supplierCreateSchema;

export const supplierListSchema = object({
  page: number().required(),
  limit: number().required(),
  search: string().nullable(),
});

export type SupplierCreate = InferType<typeof supplierCreateSchema>;
export type SupplierUpdate = InferType<typeof supplierUpdateSchema>;
export type SupplierList = InferType<typeof supplierListSchema>;
