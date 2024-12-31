import { randomUUID } from "crypto";
import { Result } from "../../../common/type";
import { MySql, pool } from "../../../helper/mysql";
import { StockApi } from "./stock_api";
import { Stock } from "./stock_model";
import { StockCreate, StockList } from "./stock_type";

export class StockMysql implements StockApi {
  async list(param: StockList): Promise<Result<Stock[]>> {
    let table = `select * from stocks where deleted is null`;
    const total = (await MySql.query(table)).length;
    const offset = (param.page - 1) * param.limit;
    const limit = param.limit;

    let query = `
        select stocks.*, products.*, suppliers.*
        from (${table}) as stocks
        left join products on products.id = stocks.productId
        left join suppliers on suppliers.id = stocks.supplierId
        `;

    if (param.search != null) {
      const search = pool.escape(param.search);
      query += ` where (suppliers.name like "%"${search}"%" or suppliers.phone like "%"${search}"%" or products.name like "%"${search}"%" or products.code like "%"${search}"%")`;
    }

    query += ` order by products.name asc limit ${limit} offset ${offset}`;

    const datas = await MySql.query({ sql: query, nestTables: true });

    const result = datas.reduce((a: any, b: any) => {
      const index = a.findIndex((e: any) => e.id == b.stocks.id);

      if (index == -1) {
        a.push({ ...b.stocks, product: b.products, supplier: b.suppliers });
      }

      return a;
    }, []);

    const data = {
      data: result,
      paging: {
        page: param.page,
        limit: param.limit,
        total: total,
      },
    };

    return data;
  }

  async create(param: StockCreate): Promise<void> {
    await MySql.query("insert into stocks set ?", {
      ...param,
      id: randomUUID(),
      created: new Date(),
      updated: new Date(),
    });
  }

  async read(id: string): Promise<Stock | null | undefined> {
    let query = `
        select stocks.*, products.*, suppliers.*
        from (select * from stocks where deleted is null and id = ${pool.escape(
          id
        )}) as stocks
        left join products on products.id = stocks.productId
        left join suppliers on suppliers.id = stocks.supplierId
        `;

    const datas = await MySql.query({
      sql: query,
      nestTables: true,
    });

    const result = datas.map((e: any) => [
      { ...e.stocks, product: e.products, supplier: e.suppliers },
    ]);

    if (result.length > 0) {
      return result[0];
    }

    return null;
  }

  async remove(id: string): Promise<void> {
    await MySql.query("update stocks set deleted = ? where id = ?", [
      new Date(),
      id,
    ]);
  }
}
