import { ProductRepository } from "../feature/product/product_repository";
import { PurchaseMysql } from "../feature/purchase/service/purchase_mysql";
import { PurchaseService } from "../feature/purchase/service/purchase_service";
import { UserController } from "../feature/user/controller/user_controller";
import { UserApi } from "../feature/user/model/user_api";
import { UserMysql } from "../feature/user/model/user_mysql";

// const user = new UserMysql();
// const encryptor = new EncryptoBcrypt();
// const signer = new SignerJwt();
const purchaseMysql = new PurchaseMysql();

// export const auth: AuthRepository = new AuthRepository(user, encryptor, signer);
export const product: ProductRepository = new ProductRepository();
export const purchase = new PurchaseService(purchaseMysql);

const userApi: UserApi = new UserMysql();
export const userController = new UserController(userApi);
