import { Result } from "../../../common/type";
import { MySql, pool } from "../../../helper/mysql";
import { SupplierApi } from "./supplier_api";
import {
  Supplier,
  SupplierCreate,
  SupplierList,
  SupplierUpdate,
} from "./supplier_type";

export class SupplierMysql implements SupplierApi {
  async create(param: SupplierCreate): Promise<void> {
    await MySql.query("insert into suppliers set ?", {
      ...param,
      created: new Date(),
      updated: new Date(),
    });
  }

  async read(id: string): Promise<Supplier | null | undefined> {
    const result = await MySql.query(
      "select * from suppliers where id = ? and deleted is null",
      id
    );

    if (result.length > 0) {
      return result[0];
    }

    return null;
  }

  async update(id: string, param: SupplierUpdate): Promise<void> {
    await MySql.query("update suppliers set ? where id = ?", [
      { ...param, updated: new Date() },
      id,
    ]);
  }

  async delete(id: string): Promise<void> {
    await MySql.query("update suppliers set ? where id = ?", [
      { deleted: new Date() },
      id,
    ]);
  }

  async list(param: SupplierList): Promise<Result<Supplier[]>> {
    let query = "select * from suppliers where deleted is null";

    if (param.search != null) {
      const search = pool.escape(param.search);
      query += ` and (name like "%"${search}"%" or phone like "%"${search}"%")`;
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
