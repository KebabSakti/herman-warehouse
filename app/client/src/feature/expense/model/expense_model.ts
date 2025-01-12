export interface Expense {
  id: string;
  title: string;
  amount: number;
  file?: string | File | null | undefined;
  printed?: string | null | undefined;
  created?: string | null | undefined;
  updated?: string | null | undefined;
  deleted?: string | null | undefined;
}

export interface ExpenseList {
  start?: string | null | undefined;
  end?: string | null | undefined;
  page?: number | null | undefined;
  limit?: number | null | undefined;
  search?: string | null | undefined;
}

export interface ExpenseSummary {
  data: Expense[];
  record: number;
}
