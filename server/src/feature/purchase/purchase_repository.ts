import { Result } from "../../common/type";
import { MySql, pool } from "../../helper/mysql";
import {
  Purchase,
  PurchaseCreateParam,
  PurchaseListParam,
} from "./purchase_type";

export class PurchaseRepository {
  async list(param: PurchaseListParam): Promise<Result<Purchase[]>> {
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
    const purchases = await MySql.query(query);
    const result: any = [];

    for await (let purchase of purchases) {
      const inventory = await MySql.query(
        "select * from inventories where purchaseId = ?",
        purchase.id
      );

      const payment = await MySql.query(
        "select * from payments where purchaseId = ?",
        purchase.id
      );

      result.push({ ...purchase, inventory: inventory, payment: payment });
    }

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

  async create(param: PurchaseCreateParam): Promise<void> {
    await MySql.transaction(async (connection) => {
      const supplier = await new Promise((resolve, reject) => {
        connection.query(
          "select * from suppliers where id = ? and deleted is null",
          param.supplierId,
          (err, res) => {
            if (err) reject(err);
            if (res.length == 0) reject(err);
            resolve(res[0]);
          }
        );
      });
    });
  }

  async read(id: string): Promise<Result<Purchase> | null | undefined> {
    const purchase = await MySql.query(
      "select * from purchases where id = ?",
      id
    );

    const inventory = await MySql.query(
      "select * from inventories where purchaseId = ?",
      id
    );

    const payment = await MySql.query(
      "select * from payments where purchaseId = ?",
      id
    );

    if (purchase.length > 0) {
      const data = {
        data: { ...purchase[0], inventory: inventory, payment: payment },
        paging: {
          page: 1,
          limit: 10,
          total: 1,
        },
      };

      return data;
    }

    return null;
  }
}
