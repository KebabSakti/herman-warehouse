export interface UserModel {
  id?: string | null;
  uid?: string | null;
  password?: string | null;
  active?: boolean | null;
  role?: string | null;
  name?: string | null;
  phone?: string | null;
  crated?: Date | null;
  updated?: Date | null;
  deleted?: Date | null;
}

export type UserCreateParam = UserModel;

export type UserUpdateParam = {
  password?: string | null;
  active?: boolean | null;
  role?: string | null;
  name?: string | null;
  phone?: string | null;
  updated?: Date | null;
};

export type UserListParam = {
  uid?: string | null;
  active?: boolean | null;
  role?: string | null;
  name?: string | null;
  phone?: string | null;
};
