import { BadRequest } from "../../../common/error";
import { MySql, pool } from "../../../helper/mysql";
import { now } from "../../../helper/util";
import { UserApi } from "./user_api";
import {
  User,
  UserCreate,
  UserList,
  UserSummary,
  UserUpdate,
} from "./user_type";

export class UserMysql implements UserApi {
  async create(param: UserCreate): Promise<void> {
    try {
      await MySql.query("insert into users set ?", {
        ...param,
        created: now(),
        updated: now(),
      });
    } catch (error: any) {
      if (error.code == "ER_DUP_ENTRY") {
        throw new BadRequest(
          `Username [${param.uid}] sudah terpakai, harap gunakan yang lain`
        );
      } else {
        throw error;
      }
    }
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
      { ...param, updated: now() },
      id,
    ]);
  }

  async delete(id: string): Promise<void> {
    await MySql.query("update users set ? where id = ?", [
      { deleted: now() },
      id,
    ]);
  }

  async list(param: UserList): Promise<UserSummary> {
    let table = "select * from users where deleted is null";
    let query = table;

    if (param.search != null) {
      const search = pool.escape(param.search);
      query += ` and (uid like "%"${search}"%" or name like "%"${search}"%")`;
    }

    query += ` order by name asc`;

    const offset = (param.page - 1) * param.limit;
    const limit = param.limit;
    query += ` limit ${limit} offset ${offset}`;

    const result = await MySql.query(query);
    const total = param.search
      ? result.length
      : (await MySql.query(table)).length;

    return {
      data: result,
      record: total,
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
