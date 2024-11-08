import { Result } from "../../common/type";
import { MySql, pool } from "../../helper/mysql";
import {
  Product,
  ProductCreateParam,
  ProductListParam,
  ProductUpdateParam,
} from "./product_type";

export class ProductRepository {
  async create(param: ProductCreateParam): Promise<void> {
    await MySql.query("insert into products set ?", {
      ...param,
      created: new Date(),
      updated: new Date(),
    });
  }

  async update(id: string, param: ProductUpdateParam): Promise<void> {
    await MySql.query("update products set ? where ?", [
      { ...param, updated: new Date() },
      { id: id },
    ]);
  }

  async delete(id: string): Promise<void> {
    await MySql.query("update products set ? where ?", [
      { deleted: new Date() },
      { id: id },
    ]);
  }

  async list(param: ProductListParam): Promise<Result<Product[]>> {
    let query = "select * from products where deleted is null";

    if (param.search != null) {
      const search = pool.escape(param.search);
      query += ` and (name like "%"${search}"%" or code like "%"${search}"%")`;
    }

    const total = (await MySql.query(query)).length;
    query += ` order by name asc`;

    // if (param.search == null) {
    const offset = (param.page - 1) * param.limit;
    const limit = param.limit;
    query += ` limit ${limit} offset ${offset}`;
    // }

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
