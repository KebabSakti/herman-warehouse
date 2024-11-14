import { date, InferType, object, string } from "yup";

export const supplierSchema = object({
  id: string().required(),
  name: string().required(),
  phone: string().nullable(),
  address: string().nullable(),
  created: date().nullable(),
  updated: date().nullable(),
  deleted: date().nullable(),
});

export type Supplier = InferType<typeof supplierSchema>;
