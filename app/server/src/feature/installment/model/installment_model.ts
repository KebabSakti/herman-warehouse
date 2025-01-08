export interface Installment {
  id: string;
  invoiceId: string;
  amount: number;
  outstanding: number;
  note?: string | null | undefined;
  attachment?: string | File | null | undefined;
  printed?: string | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}
