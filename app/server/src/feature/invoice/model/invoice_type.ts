import { array, InferType, number, object, string } from "yup";

export const invoiceCreateSchema = object({
  id: string().required(),
  customerId: string().required(),
  note: string().nullable(),
  item: array(
    object({
      invoiceId: string().required(),
      stockId: string().required(),
      supplierId: string().required(),
      productId: string().required(),
      qty: number().required(),
      price: number().required(),
    })
  )
    .min(1)
    .required(),
  installment: object({
    invoiceId: string().required(),
    amount: number().required(),
    attachment: string().nullable(),
    note: string().nullable(),
  }).nullable(),
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
