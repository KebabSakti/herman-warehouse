import { date, InferType, number, object, string } from "yup";

export const productSchema = object({
  id: string().required(),
  code: string().required(),
  name: string().required(),
  note: string().nullable(),
  created: date().required(),
  updated: date().required(),
  deleted: date().nullable(),
});

export const productListSchema = object({
  page: number().required(),
  limit: number().required(),
  search: string().nullable(),
});

export const productCreateSchema = object({
  code: string().required(),
  name: string().required(),
  note: string().nullable(),
});

export const productUpdateSchema = object({
  code: string().required(),
  name: string().required(),
  note: string().nullable(),
});

export type Product = InferType<typeof productSchema>;
export type ProductList = InferType<typeof productListSchema>;
export type ProductCreate = InferType<typeof productCreateSchema>;
export type ProductUpdate = InferType<typeof productUpdateSchema>;
