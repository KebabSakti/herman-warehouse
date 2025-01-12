import { Expense, ExpenseSummary } from "./expense_model";

export interface ExpenseApi {
  list(param: Expense, extra?: Record<string, any>): Promise<ExpenseSummary>;
  create(param: Expense, extra?: Record<string, any>): Promise<void>;
  read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Expense | null | undefined>;
  update(
    id: string,
    param: Expense,
    extra?: Record<string, any>
  ): Promise<void>;
  remove(id: string, extra?: Record<string, any>): Promise<void>;
}
