import { ExpenseApi } from "../model/expense_api";
import { Expense, ExpenseSummary } from "../model/expense_model";

export class ExpenseController {
  private expenseApi: ExpenseApi;

  constructor(expenseApi: ExpenseApi) {
    this.expenseApi = expenseApi;
  }

  async list(
    param: Expense,
    extra?: Record<string, any>
  ): Promise<ExpenseSummary> {
    const result = await this.expenseApi.list(param, extra);

    return result;
  }

  async create(param: Expense, extra?: Record<string, any>): Promise<void> {
    await this.expenseApi.create(param, extra);
  }

  async read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Expense | null | undefined> {
    const result = await this.expenseApi.read(id, extra);

    return result;
  }

  async update(
    id: string,
    param: Expense,
    extra?: Record<string, any>
  ): Promise<void> {
    await this.expenseApi.update(id, param, extra);
  }

  async remove(id: string, extra?: Record<string, any>): Promise<void> {
    await this.expenseApi.remove(id, extra);
  }
}
