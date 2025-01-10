import { InferType, mixed, number, object, string } from "yup";

export const ledgerCreateSchema = object({
  id: string().required(),
  purchaseId: string().required(),
  supplierId: string().required(),
  amount: number().required(),
  outstanding: number().required(),
  file: mixed().nullable(),
  note: string().nullable(),
  printed: string().required("Tanggal tidak boleh kosong"),
});

export const ledgerListSchema = object({
  page: number().nullable(),
  limit: number().nullable(),
});

export type LedgerList = InferType<typeof ledgerListSchema>;
export type LedgerCreate = InferType<typeof ledgerCreateSchema>;
