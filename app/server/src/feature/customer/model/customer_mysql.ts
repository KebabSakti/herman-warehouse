import dayjs from "dayjs";
import { Result } from "../../../common/type";
import { pool, MySql } from "../../../helper/mysql";
import { CustomerApi } from "./customer_api";
import { Customer } from "./customer_model";
import { CustomerList, CustomerCreate, CustomerUpdate } from "./customer_type";

export class CustomerMysql implements CustomerApi {
  async list(param: CustomerList): Promise<Result<Customer[]>> {
    let table = `select * from customers where deleted is null`;

    if (param.search != null) {
      const search = pool.escape(param.search);
      table += ` and (name like "%"${search}"%" or phone like "%"${search}"%")`;
    }

    const total = (await MySql.query(table)).length;
    const offset = (param.page - 1) * param.limit;
    const limit = param.limit;
    table += ` order by name asc limit ${limit} offset ${offset}`;
    const result = await MySql.query(table);

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

  async create(param: CustomerCreate): Promise<void> {
    const today = dayjs().format("YYYY-MM-DD HH:mm:ss");

    await MySql.query(
      "insert into customers (id, name, phone, address, created, updated) values (?, ?, ?, ?, ?, ?)",
      [param.id, param.name, param.phone, param.address, today, today]
    );
  }

  async read(id: string): Promise<Customer | null | undefined> {
    const result = await MySql.query("select * from customers where id = ?", [
      id,
    ]);

    if (result.length > 0) {
      return result[0];
    }

    return null;
  }

  async update(id: string, param: CustomerUpdate): Promise<void> {
    await MySql.query(
      "update customers set name = ?, phone = ?, address = ?, updated = ? where id = ?",
      [
        param.name,
        param.phone,
        param.address,
        dayjs().format("YYYY-MM-DD HH:mm:ss"),
        id,
      ]
    );
  }

  async remove(id: string): Promise<void> {
    await MySql.query("update customers set deleted = ? where id = ?", [
      dayjs().format("YYYY-MM-DD HH:mm:ss"),
      id,
    ]);
  }
}
