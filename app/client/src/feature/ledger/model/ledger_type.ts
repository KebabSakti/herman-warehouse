import { InferType, mixed, number, object, string } from "yup";
import { FILE_SIZE, IMAGE_FORMATS } from "../../../common/common";

export const ledgerCreateSchema = object({
  id: string().required(),
  purchaseId: string().required(),
  supplierId: string().required("Supplier tidak boleh kosong"),
  amount: number().required("Jumlah tidak boleh kosong"),
  outstanding: number().required(),
  note: string().nullable(),
  file: mixed()
    .nullable()
    .notRequired()
    .test("fileSize", "Maksimal ukuran file < 2MB", (value: any) => {
      return !value || value.size <= FILE_SIZE;
    })
    .test("fileFormat", "Format file tidak didukung", (value: any) => {
      return !value || IMAGE_FORMATS.includes(value.type);
    }),
});

export const ledgerListSchema = object({
  page: number().required(),
  limit: number().required(),
  search: string().nullable(),
  start: string().nullable(),
  end: string().nullable(),
});

export type ledgerList = InferType<typeof ledgerListSchema>;
export type ledgerCreate = InferType<typeof ledgerCreateSchema>;
