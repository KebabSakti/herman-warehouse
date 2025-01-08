import { InferType, mixed, number, object, string } from "yup";
import { FILE_SIZE, IMAGE_FORMATS } from "../../../common/common";

export const installmentCreateSchema = object({
  id: string().required(),
  invoiceId: string().required(),
  amount: number().required("Kolom jumlah tidak boleh kosong"),
  note: string().nullable(),
  printed: string().required("Kolom tanggal tidak boleh kosong"),
  attachment: mixed()
    .nullable()
    .notRequired()
    .test("fileSize", "Maksimal ukuran file adalah 2MB", (value: any) => {
      return !value || value.size <= FILE_SIZE;
    })
    .test("fileFormat", "Format file tidak didukung", (value: any) => {
      return !value || IMAGE_FORMATS.includes(value.type);
    }),
});

export const installmentListSchema = object({
  page: number().required(),
  limit: number().required(),
  invoiceId: string().required(),
});

export type InstallmentList = InferType<typeof installmentListSchema>;
export type InstallmentCreate = InferType<typeof installmentCreateSchema>;
