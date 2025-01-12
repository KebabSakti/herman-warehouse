import dayjs from "dayjs";
import { MySql, pool } from "../../../helper/mysql";
import { CreditApi } from "./credit_api";
import { CreditList, CreditSummary } from "./credit_model";

export class CreditMysql implements CreditApi {
  async list(param: CreditList): Promise<CreditSummary> {
    const startDate = dayjs
      .tz(`${param.start}T00:00:00`, "Asia/Kuala_Lumpur")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    const endDate = dayjs
      .tz(`${param.end}T23:59:59`, "Asia/Kuala_Lumpur")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    let table = `select
                 c.id,c.name,c.phone,
                 count(i.id) as nota,
                 sum(i.outstanding) as total,
                 count(case when i.outstanding > 0 then 1 end) as unpaid,
                 count(case when i.outstanding = 0 then 1 end) as paid
                 from customers c
                 left join invoices i on c.id = i.customerId
                 where i.deleted is null 
                 and i.printed between ${pool.escape(
                   startDate
                 )} and ${pool.escape(endDate)}`;

    let query = table;

    if (param && param.search) {
      const search = pool.escape(param.search);
      query += ` and (c.name like "%"${search}"%" or c.phone like "%"${search}"%")`;
    }

    const group = ` group by c.id, c.name having total > 0 order by c.name asc`;

    table += group;
    query += group;

    const result = await MySql.query(query);
    const sql = await MySql.query(table);
    const sumNota = sql.reduce((a: any, b: any) => a + b.nota, 0);
    const sumTotal = sql.reduce((a: any, b: any) => a + b.total, 0);
    const sumPaid = sql.reduce((a: any, b: any) => a + b.paid, 0);
    const sumUnpaid = sql.reduce((a: any, b: any) => a + b.unpaid, 0);

    let data: CreditSummary = {
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
