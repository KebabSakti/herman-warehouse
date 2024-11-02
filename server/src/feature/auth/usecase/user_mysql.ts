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
    const user = await MySql.connect(
      "select * from users where id = ? and deleted is null",
      id
    );

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

  list(
    param?: UserListParam | null,
    extra?: Map<string, any> | null
  ): Promise<UserModel[]> {
    throw new Error("Method not implemented.");
  }
}
