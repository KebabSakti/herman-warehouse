import { Expense, ExpenseList, ExpenseSummary } from "./expense_model";

export interface ExpenseApi {
  list(param: ExpenseList): Promise<ExpenseSummary>;
  create(param: Expense): Promise<void>;
  read(id: string): Promise<Expense | null | undefined>;
  update(id: string, param: Expense): Promise<void>;
  remove(id: string): Promise<void>;
}
