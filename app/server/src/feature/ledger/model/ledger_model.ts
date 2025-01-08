export interface Ledger {
  id: string;
  purchaseId: string;
  supplierId: string;
  amount: number;
  file?: string | null | undefined;
  note?: string | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}
