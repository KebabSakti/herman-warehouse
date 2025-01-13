import {
  User,
  UserCreate,
  UserList,
  UserLogin,
  UserSummary,
  UserUpdate,
} from "./user_type";

export abstract class UserApi {
  abstract create(
    param: UserCreate,
    extra?: Record<string, any> | null | undefined
  ): Promise<void>;

  abstract read(
    id: string,
    extra?: Record<string, any> | null | undefined
  ): Promise<User | null | undefined>;

  abstract update(
    id: string,
    param: UserUpdate,
    extra?: Record<string, any> | null | undefined
  ): Promise<void>;

  abstract delete(
    id: string,
    extra?: Record<string, any> | null | undefined
  ): Promise<void>;

  abstract list(
    param: UserList,
    extra?: Record<string, any> | null | undefined
  ): Promise<UserSummary>;

  abstract login(param: UserLogin): Promise<string | null | undefined>;
}
