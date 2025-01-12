import dayjs from "dayjs";
import { MySql, pool } from "../../../helper/mysql";
import { ProfitApi } from "./profit_api";
import { ProfitList, ProfitSummary } from "./profit_model";

export class ProfitMysql implements ProfitApi {
  async list(param: ProfitList): Promise<ProfitSummary> {
    const startDate = dayjs
      .tz(`${param.start}T00:00:00`, "Asia/Kuala_Lumpur")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    const endDate = dayjs
      .tz(`${param.end}T23:59:59`, "Asia/Kuala_Lumpur")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    let table = `select
                 printed,totalItem,margin,
                 sum(totalItem) as total,
                 sum(margin) as profit
                 from purchases
                 where deleted is null 
                 and printed between ${pool.escape(
                   startDate
                 )} and ${pool.escape(endDate)}`;

    let query = table;
    const group = ` group by printed having profit > 0 order by printed asc`;
    table += group;
    query += group;

    const result = await MySql.query(query);
    const sql = await MySql.query(table);
    const sumTotal = sql.reduce((a: any, b: any) => a + b.totalItem, 0);
    const sumProfit = sql.reduce((a: any, b: any) => a + b.margin, 0);

    let data: ProfitSummary = {
      data: result,
      total: sumTotal,
      profit: sumProfit,
      record: sql.length,
    };

    return data;
  }
}
