import { EncryptoBcrypt } from "./../feature/auth/usecase/encryptor_bcrypt";
import { AuthRepository } from "../feature/auth/repository/auth_repository";
import { UserMysql } from "../feature/auth/usecase/user_mysql";
import { SignerJwt } from "../feature/auth/usecase/signer_jwt";

const user = new UserMysql();
const encryptor = new EncryptoBcrypt();
const signer = new SignerJwt();

export const auth: AuthRepository = new AuthRepository(
  user,
  encryptor,
  signer
);
