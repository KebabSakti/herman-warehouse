import { array, boolean, InferType, number, object, string } from "yup";

export const invoiceCreateSchema = object({
  id: string().required(),
  customerId: string().required("Kustomer tidak boleh kosong"),
  customerName: string().required("Kustomer tidak boleh kosong"),
  customerPhone: string().nullable(),
  customerAddress: string().nullable(),
  code: string().required(),
  note: string().nullable(),
  totalItem: number().required(),
  totalPaid: number().required(),
  total: number().required(),
  outstanding: number().required(),
  printed: string().required("Tanggal tidak boleh kosong"),
  item: array(
    object({
      id: string().required(),
      invoiceId: string().required(),
      stockId: string().required(),
      productId: string().required(),
      productCode: string().required(),
      productName: string().required(),
      productNote: string().nullable(),
      supplierId: string().required(),
      supplierName: string().required(),
      supplierPhone: string().nullable(),
      qty: number().required(),
      price: number().required(),
      total: number().required(),
    })
  )
    .min(1)
    .required("Tambahkan minimal 1 produk"),
  installment: array(
    object({
      id: string().required(),
      invoiceId: string().required(),
      amount: number().required("Total tidak boleh kosong"),
      outstanding: number().required(),
      note: string().nullable(),
      attachment: string().nullable(),
      dp: boolean().nullable(),
    })
  ).nullable(),
});

export const invoiceListSchema = object({
  page: number().required(),
  limit: number().required(),
  search: string().nullable(),
  start: string().nullable(),
  end: string().nullable(),
});

export type InvoiceList = InferType<typeof invoiceListSchema>;
export type InvoiceCreate = InferType<typeof invoiceCreateSchema>;
