import { bool, date, InferType, number, object, string } from "yup";

export const userSchema = object({
  id: string().required(),
  uid: string().required(),
  password: string().required(),
  active: bool().optional(),
  role: string().oneOf(["owner", "admin", "system"]),
  name: string().required(),
  phone: string().required(),
  created: date().nullable(),
  updated: date().nullable(),
  deleted: date().nullable(),
});

export const userCreateSchema = object({
  id: string().required(),
  uid: string().required(),
  password: string().required(),
  name: string().required(),
  phone: string().nullable(),
  active: number().required(),
});

export const userUpdateSchema = object({
  id: string().required(),
  uid: string().required(),
  password: string().nullable(),
  name: string().required(),
  phone: string().nullable(),
  active: number().required(),
});

export const userListSchema = object({
  page: number().required(),
  limit: number().required(),
  search: string().nullable(),
});

export const userLoginSchema = object({
  uid: string().required(),
  password: string().required(),
});

export type User = InferType<typeof userSchema>;
export type UserCreate = InferType<typeof userCreateSchema>;
export type UserUpdate = InferType<typeof userUpdateSchema>;
export type UserList = InferType<typeof userListSchema>;
export type UserLogin = InferType<typeof userLoginSchema>;
export type UserSummary = {
  data: User[];
  record: number;
};
