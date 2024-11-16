import { randomUUID } from "crypto";
import { Result } from "../../../common/type";
import { MySql, pool } from "../../../helper/mysql";
import { ProductApi } from "./product_api";
import {
  Product,
  ProductCreate,
  ProductList,
  ProductUpdate,
} from "./product_type";

export class ProductMysql implements ProductApi {
  async create(param: ProductCreate): Promise<void> {
    await MySql.query("insert into products set ?", {
      ...param,
      id: randomUUID(),
      created: new Date(),
      updated: new Date(),
    });
  }

  async read(id: string): Promise<Product | null | undefined> {
    const result = await MySql.query(
      "select * from products where id = ? and deleted is null",
      id
    );

    if (result.length > 0) {
      return result[0];
    }

    return null;
  }

  async update(id: string, param: ProductUpdate): Promise<void> {
    await MySql.query("update products set ? where id = ?", [
      { ...param, updated: new Date() },
      id,
    ]);
  }

  async delete(id: string): Promise<void> {
    await MySql.query("update products set ? where id = ?", [
      { deleted: new Date() },
      id,
    ]);
  }

  async list(param: ProductList): Promise<Result<Product[]>> {
    let query = "select * from products where deleted is null";

    if (param.search != null) {
      const search = pool.escape(param.search);
      query += ` and (name like "%"${search}"%" or code like "%"${search}"%")`;
    }

    const total = (await MySql.query(query)).length;
    query += ` order by created desc`;

    const offset = (param.page - 1) * param.limit;
    const limit = param.limit;
    query += ` limit ${limit} offset ${offset}`;

    const result = await MySql.query(query);

    return {
      data: result,
      paging: {
        page: param.page,
        limit: param.limit,
        total: total,
      },
    };
  }
}
