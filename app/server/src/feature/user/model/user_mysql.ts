import { randomUUID } from "crypto";
import { Result } from "../../../common/type";
import { MySql, pool } from "../../../helper/mysql";
import { UserApi } from "./user_api";
import { User, UserCreate, UserList, UserUpdate } from "./user_type";

export class UserMysql implements UserApi {
  async create(param: UserCreate): Promise<void> {
    await MySql.query("insert into users set ?", {
      ...param,
      id: randomUUID(),
      created: new Date(),
      updated: new Date(),
    });
  }

  async read(id: string): Promise<User | null | undefined> {
    const result = await MySql.query(
      "select * from users where id = ? and deleted is null",
      id
    );

    if (result.length > 0) {
      return result[0];
    }

    return null;
  }

  async update(id: string, param: UserUpdate): Promise<void> {
    await MySql.query("update users set ? where id = ?", [
      { ...param, updated: new Date() },
      id,
    ]);
  }

  async delete(id: string): Promise<void> {
    await MySql.query("update users set ? where id = ?", [
      { deleted: new Date() },
      id,
    ]);
  }

  async list(param: UserList): Promise<Result<User[]>> {
    let query = "select * from users where deleted is null";

    if (param.search != null) {
      const search = pool.escape(param.search);
      query += ` and (uid like "%"${search}"%" or code name "%"${search}"%")`;
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

  async find(uid: string): Promise<User | null | undefined> {
    const result = await MySql.query(
      "select * from users where uid = ? and deleted is null",
      uid
    );

    if (result.length > 0) {
      return result[0];
    }

    return null;
  }
}
