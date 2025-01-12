import dayjs from "dayjs";
import { Result } from "../../../common/type";
import { MySql, pool } from "../../../helper/mysql";
import { SaleApi } from "./sale_api";
import { Sale, SaleList, SaleSummary } from "./sale_model";

export class SaleMysql implements SaleApi {
  async list(param: SaleList): Promise<SaleSummary> {
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
                 sum(i.total) as total
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

    const group = ` group by c.id, c.name having nota > 0 order by c.name asc`;

    table += group;
    query += group;

    const result = await MySql.query(query);
    const sql = await MySql.query(table);
    const sumNota = sql.reduce((a: any, b: any) => a + b.nota, 0);
    const sumTotal = sql.reduce((a: any, b: any) => a + b.total, 0);

    let data: SaleSummary = {
      data: result,
      nota: sumNota,
      total: sumTotal,
      record: sql.length,
    };

    return data;
  }
}
