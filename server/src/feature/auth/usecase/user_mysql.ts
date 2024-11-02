import { MySql } from "../../../helper/mysql";
import { UserApi } from "../api/user_api";
import {
  UserCreateParam,
  UserListParam,
  UserModel,
  UserUpdateParam,
} from "../model/user_model";

export class UserMysql implements UserApi {
  async create(params: UserCreateParam): Promise<void> {
    await MySql.connect("insert into users set ?", params);
  }

  async read(id: string): Promise<UserModel | null | undefined> {
    const user = await MySql.connect("select * from users where id = ?", id);

    if (user.length > 0) {
      return user[0];
    }

    return null;
  }

  async update(id: string, param: UserUpdateParam): Promise<void> {
    await MySql.connect("update users set ? where ?", [param, { id: id }]);
  }

  async remove(id: string): Promise<void> {
    await MySql.connect("update users set ? where ?", [
      { deleted: new Date() },
      { id: id },
    ]);
  }

  async find(uid: string): Promise<UserModel | null | undefined> {
    const user = await MySql.connect("select * from users where uid = ?", uid);

    if (user.length > 0) {
      return user[0];
    }

    return null;
  }

  list(
    param?: UserListParam | null,
    extra?: Map<string, any> | null
  ): Promise<UserModel[]> {
    // let sql = "select * from kir where deleted is null";

    // if (param?.certificateNumber != undefined) {
    //   sql += ` and certificateNumber like ${pool.escape(
    //     `%${param.certificateNumber}%`
    //   )}`;
    // }

    // sql += " order by created desc";

    // if (param?.pagination != undefined) {
    //   sql += ` limit ${pool.escape(
    //     Number(param.pagination.take)
    //   )} offset ${pool.escape(Number(param.pagination.skip))}`;
    // }

    // const data = await MySql.query(sql);

    // return data;

    throw new Error("Method not implemented.");
  }
}
