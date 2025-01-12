import { ExpenseApi } from "../model/expense_api";
import { Expense, ExpenseList, ExpenseSummary } from "../model/expense_model";

export class ExpenseController {
  private expenseApi: ExpenseApi;

  constructor(expenseApi: ExpenseApi) {
    this.expenseApi = expenseApi;
  }

  async list(param: ExpenseList): Promise<ExpenseSummary> {
    const result = await this.expenseApi.list(param);

    return result;
  }

  async create(param: Expense): Promise<void> {
    await this.expenseApi.create(param);
  }

  async read(id: string): Promise<Expense | null | undefined> {
    const result = await this.expenseApi.read(id);

    return result;
  }

  async update(id: string, param: Expense): Promise<void> {
    await this.expenseApi.update(id, param);
  }

  async remove(id: string): Promise<void> {
    await this.expenseApi.remove(id);
  }
}
