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
  id: string().required(),
  code: string().required(),
  name: string().required(),
  note: string().nullable(),
});

export const productUpdateSchema = object({
  code: string().nullable(),
  name: string().nullable(),
  note: string().nullable(),
});

export type Product = InferType<typeof productSchema>;
export type ProductListParam = InferType<typeof productListSchema>;
export type ProductCreateParam = InferType<typeof productCreateSchema>;
export type ProductUpdateParam = InferType<typeof productUpdateSchema>;
