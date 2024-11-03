import { UserModel } from "./user_model";

export interface AuthModel {
  user: UserModel;
  token: string;
}
