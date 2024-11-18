import { InferType, object, string } from "yup";

export const userLoginSchema = object({
  uid: string().required(),
  password: string().required(),
});

export type AuthLogin = InferType<typeof userLoginSchema>;
