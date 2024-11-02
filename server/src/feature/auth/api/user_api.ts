import {
  UserCreateParam,
  UserListParam,
  UserModel,
  UserUpdateParam,
} from "../model/user_model";

export abstract class UserApi {
  abstract create(params: UserCreateParam): Promise<void>;

  abstract read(
    id: string,
    deleted?: Date | null
  ): Promise<UserModel | null | undefined>;

  abstract update(id: string, param: UserUpdateParam): Promise<void>;

  abstract remove(id: string, deleted: Date): Promise<void>;

  abstract list(
    param?: UserListParam | null,
    extra?: Map<string, any> | null
  ): Promise<UserModel[]>;
}
