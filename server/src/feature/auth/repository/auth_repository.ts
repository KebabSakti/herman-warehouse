import { EncryptorApi } from "../api/encryptor_api";
import { SignerApi } from "../api/signer_api";
import { UserApi } from "../api/user_api";
import { AuthModel } from "../model/auth_model";

export class AuthRepository {
  constructor(
    userApi: UserApi,
    encryptorApi: EncryptorApi,
    signerApi: SignerApi
  ) {
    this.userApi = userApi;
    this.encryptorApi = encryptorApi;
    this.signerApi = signerApi;
  }

  userApi: UserApi;
  encryptorApi: EncryptorApi;
  signerApi: SignerApi;

  async login(
    uid: string,
    password: string
  ): Promise<string | null | undefined> {
    const user = await this.userApi.find(uid);

    if (user != null) {
      const passwordIsValid = await this.encryptorApi.compare(
        password,
        user.password!
      );

      if (passwordIsValid) {
        const token = await this.signerApi.sign({
          id: user.id!,
          uid: user.uid!,
          role: user.role!,
        });

        return token;
      }
    }

    return null;
  }

  async validate(token: string): Promise<AuthModel | null | undefined> {
    const payload = await this.signerApi.verify(token);

    if (payload != null) {
      const user = await this.userApi.read(payload.id);

      if (user != null) {
        return payload;
      }
    }

    return null;
  }
}
