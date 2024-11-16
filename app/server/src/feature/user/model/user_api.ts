import { Result } from "../../../common/type";
import { User, UserCreate, UserList, UserUpdate } from "./user_type";

export abstract class UserApi {
  abstract create(param: UserCreate): Promise<void>;
  abstract read(id: string): Promise<User | null | undefined>;
  abstract update(id: string, param: UserUpdate): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract list(param: UserList): Promise<Result<User[]>>;
  abstract find(uid: string): Promise<User | null | undefined>;
}
