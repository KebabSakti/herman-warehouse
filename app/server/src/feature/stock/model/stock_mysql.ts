import { Result } from "../../../common/type";
import { MySql, pool } from "../../../helper/mysql";
import { StockApi } from "./stock_api";
import { Stock } from "./stock_model";
import { StockList, StockCreate } from "./stock_type";

export class StockMysql implements StockApi {
  async list(param: StockList): Promise<Result<Stock[]>> {
    let table = `select * from stocks where deleted is null`;

    if (param.search != null) {
      const search = pool.escape(param.search);
      table += ` and (suppliers.name like "%"${search}"%" or suppliers.phone like "%"${search}"%" or products.name like "%"${search}"%")`;
    }

    const total = (await MySql.query(table)).length;
    const offset = (param.page - 1) * param.limit;
    const limit = param.limit;
    table += ` order by products.name asc limit ${limit} offset ${offset}`;

    let query = `
        select stocks.*, products.*, suppliers.*
        from (${table}) as stocks
        left join products on products.id = stocks.productId
        left join suppliers on suppliers.id = stocks.supplierId
        `;

    const datas = await MySql.query({ sql: query, nestTables: true });
    const result = datas.reduce((a: any, b: any) => {
      const invoice = a.find((c: any) => c.id == b.invoices.id);

      if (invoice == undefined) {
        const item = { ...b.invoices, item: [], installment: [] };

        if (b.items.invoiceId == item.id) {
          item.item.push(b.items);
        }

        if (b.installments.invoiceId == item.id) {
          item.installment.push(b.installments);
        }

        a.push(item);
      } else {
        const invItem = invoice.item.find((c: any) => c.id == b.items.id);

        const installment = datas.installment.find(
          (c: any) => c.id == b.installments.id
        );

        if (invItem == undefined) {
          invoice.item.push(b.items);
        }

        if (installment == undefined) {
          invoice.installment.push(b.installments);
        }
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

  create(param: StockCreate): Promise<void> {
    throw new Error("Method not implemented.");
  }

  read(id: string): Promise<Stock | null | undefined> {
    throw new Error("Method not implemented.");
  }

  remove(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
