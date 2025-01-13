import dayjs from "dayjs";
import { MySql, pool } from "../../../helper/mysql";
import { now } from "../../../helper/util";
import { ExpenseApi } from "./expense_api";
import { Expense, ExpenseList, ExpenseSummary } from "./expense_model";

export class ExpenseMysql implements ExpenseApi {
  async list(param: ExpenseList): Promise<ExpenseSummary> {
    let table = `select * from expenses where deleted is null`;
    let query = table;

    if (param && param.search) {
      const search = pool.escape(param.search);
      query += ` and (title like "%"${search}"%")`;
    }

    if (param.start && param.end) {
      const startDate = dayjs
        .tz(`${param.start}T00:00:00`, "Asia/Kuala_Lumpur")
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");

      const endDate = dayjs
        .tz(`${param.end}T23:59:59`, "Asia/Kuala_Lumpur")
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");

      query += ` and printed between ${pool.escape(
        startDate
      )} and ${pool.escape(endDate)}`;
    }

    const result = await MySql.query(query);
    const sql = await MySql.query(table);

    let data: ExpenseSummary = {
      data: result,
      record: sql.length,
    };

    return data;
  }

  async create(param: Expense): Promise<void> {
    await MySql.query("insert into expenses set ?", {
      id: param.id,
      title: param.title,
      amount: param.amount,
      printed: param.printed,
      file: param.file && param.id + ".jpg",
      created: now(),
      updated: now(),
    });
  }

  async read(id: string): Promise<Expense | null | undefined> {
    const results = await MySql.query(
      "select * from expenses where id = ? limit 1",
      id
    );

    if (results && results[0]) {
      return results[0];
    }

    return null;
  }

  async update(id: string, param: Expense): Promise<void> {
    await MySql.query("update expenses set ? where id = ?", [
      {
        id: param.id,
        title: param.title,
        amount: param.amount,
        printed: param.printed,
        file: param.file && param.id + ".jpg",
        updated: now(),
      },
      id,
    ]);
  }

  async remove(id: string): Promise<void> {
    await MySql.query("update expenses set deleted = ? where id = ?", [
      now(),
      id,
    ]);
  }
}
