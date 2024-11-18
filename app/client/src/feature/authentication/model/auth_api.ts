import { AuthLogin } from "./auth_type";

export abstract class AuthApi {
  abstract login(param: AuthLogin): Promise<string | null | undefined>;
}
