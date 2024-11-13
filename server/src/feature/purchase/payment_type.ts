import { date, InferType, number, object, string } from "yup";

export const paymentSchema = object({
  id: string().required(),
  purchaseId: string().required(),
  amount: number().required(),
  note: string().required(),
  created: date().nullable(),
  updated: date().nullable(),
  deleted: date().nullable(),
});

export type Payment = InferType<typeof paymentSchema>;
