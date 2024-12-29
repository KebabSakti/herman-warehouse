import { array, InferType, number, object, string } from "yup";

export const invoiceCreateSchema = object({
  id: string().required(),
  customerId: string().required(),
  customerName: string().required(),
  customerPhone: string().required(),
  customerAddress: string().nullable(),
  code: string().required(),
  note: string().nullable(),
  total: number().required(),
  created: string().required(),
  updated: string().required(),
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
      supplierPhone: string().required(),
      qty: number().required(),
      price: number().required(),
      total: number().required(),
      created: string().required(),
      updated: string().required(),
    })
  )
    .min(1)
    .required(),
  installment: object({
    id: string().required(),
    invoiceId: string().required(),
    amount: number().required(),
    outstanding: number().required(),
    attachment: string().nullable(),
    note: string().nullable(),
    created: string().required(),
    updated: string().required(),
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
