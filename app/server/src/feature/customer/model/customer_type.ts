import { InferType, number, object, string } from "yup";

export const customerCreateSchema = object({
  id: string().required(),
  name: string().required(),
  phone: string().nullable(),
  address: string().nullable(),
});

export const customerListSchema = object({
  page: number().required(),
  limit: number().required(),
  search: string().nullable(),
});

export type CustomerList = InferType<typeof customerListSchema>;
export type CustomerCreate = InferType<typeof customerCreateSchema>;
export type CustomerUpdate = InferType<typeof customerCreateSchema>;
