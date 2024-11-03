export type AuthLoginParam = {
  uid: string;
  password: string;
};

export interface UserModel {}

export interface AuthModel {
  user: UserModel;
  token: string;
}
