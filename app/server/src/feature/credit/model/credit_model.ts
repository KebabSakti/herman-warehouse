export interface Credit {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string | null | undefined;
  customerOutstanding: number;
}

export interface CreditInvoice {
  id: string;
  invoiceId: string;
  invoiceCode: string;
  invoiceNote?: string | null | undefined;
  invoiceTotal: number;
  invoiceDate: string | null | undefined;
}

export interface InvoicePayment {
  id: string;
}
