import { boolean, InferType, mixed, number, object, string } from "yup";

export const ledgerCreateSchema = object({
  id: string().required(),
  purchaseId: string().nullable(),
  supplierId: string().nullable(),
  amount: number()
    .min(1, "Jumlah minimal Rp 1")
    .required("Jumlah tidak boleh kosong"),
  outstanding: number().nullable(),
  file: mixed().nullable(),
  note: string().nullable(),
  printed: string().nullable(),
  dp: boolean().nullable(),
});

export const ledgerListSchema = object({
  page: number().required(),
  limit: number().required(),
});

export type LedgerList = InferType<typeof ledgerListSchema>;
export type LedgerCreate = InferType<typeof ledgerCreateSchema>;
