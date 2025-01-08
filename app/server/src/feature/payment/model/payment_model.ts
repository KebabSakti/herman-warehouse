export interface Payment {
  id: string;
  purchaseId: string;
  amount: number;
  note: string;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}