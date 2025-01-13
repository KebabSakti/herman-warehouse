import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { MySql, pool } from "../../../helper/mysql";
import { DashboardApi } from "./dashboard_api";
import { Dashboard, DashboardRead } from "./dashboard_model";
import e from "cors";

export class DashboardMysql implements DashboardApi {
  async read(param: DashboardRead): Promise<Dashboard> {
    const startDate = dayjs
      .tz(`${param.start}T00:00:00`, "Asia/Kuala_Lumpur")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    const endDate = dayjs
      .tz(`${param.end}T23:59:59`, "Asia/Kuala_Lumpur")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    const firstDayOfCurrentYear = dayjs
      .tz(dayjs().startOf("year"), "Asia/Kuala_Lumpur")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    const lastDayOfCurrentYear = dayjs
      .tz(dayjs().endOf("year"), "Asia/Kuala_Lumpur")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    const profit = await MySql.query(`select
                                      sum(margin) as total
                                      from purchases
                                      where deleted is null 
                                      and printed between ${pool.escape(
                                        startDate
                                      )} and ${pool.escape(endDate)}`);

    const supplier = await MySql.query(`select
                                        sum(total) as total
                                        from purchases
                                        where deleted is null 
                                        and printed between ${pool.escape(
                                          startDate
                                        )} and ${pool.escape(endDate)}`);

    const customer = await MySql.query(`select
                                        sum(total) as total
                                        from invoices
                                        where deleted is null 
                                        and printed between ${pool.escape(
                                          startDate
                                        )} and ${pool.escape(endDate)}`);

    const expense = await MySql.query(`select
                                       sum(amount) as total
                                       from expenses
                                       where deleted is null 
                                       and printed between ${pool.escape(
                                         startDate
                                       )} and ${pool.escape(endDate)}`);

    const monthlyProfit = await MySql.query(`select
      DATE_FORMAT(printed, '%Y-%m') as printed,
      sum(margin) as total
      from purchases
      where deleted is null 
      and printed between ${pool.escape(
        firstDayOfCurrentYear
      )} and ${pool.escape(
      lastDayOfCurrentYear
    )} group by DATE_FORMAT(printed, '%Y-%m')
      order by DATE_FORMAT(printed, '%Y-%m') asc`);

    const monthlyExpense = await MySql.query(`select
        sum(amount) as total
        from expenses
        where deleted is null 
        and printed between ${pool.escape(
          firstDayOfCurrentYear
        )} and ${pool.escape(
      lastDayOfCurrentYear
    )} group by DATE_FORMAT(printed, '%Y-%m')
        order by DATE_FORMAT(printed, '%Y-%m') asc`);

    const a = profit?.[0]?.total ?? 0;
    const b = expense?.[0]?.total ?? 0;

    const data: Dashboard = {
      statistic: {
        id: randomUUID(),
        profit: a - b,
        customer: customer?.[0]?.total ?? 0,
        supplier: supplier?.[0]?.total ?? 0,
      },
      monthly: [...Array(12)].map((_, i) => {
        const profitTotal = monthlyProfit?.[i]?.total ?? 0;
        const expenseTotal = monthlyExpense?.[i]?.total ?? 0;
        const total = profitTotal - expenseTotal;

        return { id: randomUUID(), total: total };
      }),
    };

    return data;
  }
}
