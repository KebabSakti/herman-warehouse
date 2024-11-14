import { AuthRepository } from "../feature/auth/repository/auth_repository";
import { SignerJwt } from "../feature/auth/usecase/signer_jwt";
import { UserMysql } from "../feature/auth/usecase/user_mysql";
import { ProductRepository } from "../feature/product/product_repository";
import { EncryptoBcrypt } from "./../feature/auth/usecase/encryptor_bcrypt";
import { PurchaseService } from "./../feature/purchase/service/purchase_service";

const user = new UserMysql();
const encryptor = new EncryptoBcrypt();
const signer = new SignerJwt();

export const auth: AuthRepository = new AuthRepository(user, encryptor, signer);
export const product: ProductRepository = new ProductRepository();
export const purchase: PurchaseService = new PurchaseService();
