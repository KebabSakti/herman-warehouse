import { InferType, mixed, number, object, string } from "yup";
import { FILE_SIZE, IMAGE_FORMATS } from "../../../common/common";

export const installmentCreateSchema = object({
  id: string().required(),
  invoiceId: string().required(),
  customerId: string().required(),
  amount: number().required("Jumlah tidak boleh kosong"),
  note: string().nullable(),
  outstanding: number().default(0.0),
  printed: string().required("Tanggal tidak boleh kosong"),
  attachment: string().nullable(),
});

export const installmentListSchema = object({
  page: number().required(),
  limit: number().required(),
});

export type InstallmentList = InferType<typeof installmentListSchema>;
export type InstallmentCreate = InferType<typeof installmentCreateSchema>;
