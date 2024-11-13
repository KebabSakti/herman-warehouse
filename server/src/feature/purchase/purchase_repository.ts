import { Result } from "../../common/type";
import { MySql, pool } from "../../helper/mysql";
import { Purchase, PurhcaseListParam } from "./purchase_type";

export class PurchaseRepository {
  async purchaseList(param: PurhcaseListParam): Promise<Result<Purchase[]>> {
    let query = "select * from purchases where deleted is null";

    if (param.search != null) {
      const search = pool.escape(param.search);
      query += ` and (supplierName like "%"${search}"%" or supplierPhone like "%"${search}"%" or code like "%"${search}"%")`;
    }

    if (param.search?.length == 0) {
      const start = pool.escape(`${param.start} 00:00:00`);
      const end = pool.escape(`${param.end} 23:59:59`);
      query += ` and created between ${start} and ${end}`;
    }

    const total = (await MySql.query(query)).length;
    const offset = (param.page - 1) * param.limit;
    const limit = param.limit;
    query += ` order by created desc limit ${limit} offset ${offset}`;
    const result = await MySql.query(query);

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
}
