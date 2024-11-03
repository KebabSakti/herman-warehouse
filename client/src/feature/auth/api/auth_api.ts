export abstract class AuthApi {
  abstract login(username: string, password: string): Promise<string>;
}
