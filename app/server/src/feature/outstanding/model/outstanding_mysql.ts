import dayjs from "dayjs";
import { MySql, pool } from "../../../helper/mysql";
import { OutstandingApi } from "./outstanding_api";
import { OutstandingList, OutstandingSummary } from "./outstanding_model";

export class OutstandingMysql implements OutstandingApi {
  async list(param: OutstandingList): Promise<OutstandingSummary> {
    const startDate = dayjs
      .tz(`${param.start}T00:00:00`, "Asia/Kuala_Lumpur")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    const endDate = dayjs
      .tz(`${param.end}T23:59:59`, "Asia/Kuala_Lumpur")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    let table = `select
                   s.id,s.name,s.phone,
                   count(p.id) as nota,
                   sum(p.balance) as total,
                   count(case when p.balance > 0 then 1 end) as unpaid,
                   count(case when p.balance = 0 then 1 end) as paid
                   from suppliers s
                   left join purchases p on s.id = p.supplierId
                   where p.deleted is null 
                   and p.printed between ${pool.escape(
                     startDate
                   )} and ${pool.escape(endDate)}`;

    let query = table;

    if (param && param.search) {
      const search = pool.escape(param.search);
      query += ` and (s.name like "%"${search}"%" or s.phone like "%"${search}"%")`;
    }

    const group = ` group by s.id, s.name having total > 0 order by s.name asc`;

    table += group;
    query += group;

    const result = await MySql.query(query);
    const sql = await MySql.query(table);
    const sumNota = sql.reduce((a: any, b: any) => a + b.nota, 0);
    const sumTotal = sql.reduce((a: any, b: any) => a + b.total, 0);
    const sumPaid = sql.reduce((a: any, b: any) => a + b.paid, 0);
    const sumUnpaid = sql.reduce((a: any, b: any) => a + b.unpaid, 0);

    let data: OutstandingSummary = {
      data: result,
      nota: sumNota,
      total: sumTotal,
      paid: sumPaid,
      unpaid: sumUnpaid,
      record: sql.length,
    };

    return data;
  }
}
