import { number, object, string } from "yup";

export const writeExpenseSchema = object({
  id: string().required(),
  title: string().required("Nama transaksi tidak boleh kosong"),
  amount: number().required("Jumlah tidak boleh kosong"),
  printed: string().nullable(),
});
