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

export const paymentCreateSchema = object({
  purchaseId: string().required(),
  amount: number().required(),
  note: string().required(),
});

export type Payment = InferType<typeof paymentSchema>;
export type PaymentCreateParam = InferType<typeof paymentCreateSchema>;
