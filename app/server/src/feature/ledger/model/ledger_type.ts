import { InferType, mixed, number, object, string } from "yup";

export const ledgerCreateSchema = object({
  id: string().required(),
  purchaseId: string().required(),
  supplierId: string().required(),
  amount: number().required(),
  outstanding: number().required(),
  file: mixed().nullable(),
  note: string().nullable(),
});

export const ledgerListSchema = object({
  page: number().required(),
  limit: number().required(),
});

export type LedgerList = InferType<typeof ledgerListSchema>;
export type LedgerCreate = InferType<typeof ledgerCreateSchema>;
