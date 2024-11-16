import { ProductController } from "./product/controller/product_controller";
import { ProductApi } from "./product/model/product_api";
import { ProductMysql } from "./product/model/product_mysql";
import { PurchaseController } from "./purchase/controller/purchase_controller";
import { PurchaseApi } from "./purchase/model/purchase_api";
import { PurchaseMysql } from "./purchase/model/purchase_mysql";
import { UserController } from "./user/controller/user_controller";
import { UserApi } from "./user/model/user_api";
import { UserMysql } from "./user/model/user_mysql";

const userApi: UserApi = new UserMysql();
const productApi: ProductApi = new ProductMysql();
const purchaseApi: PurchaseApi = new PurchaseMysql();

export const userController = new UserController(userApi);
export const productController = new ProductController(productApi);
export const purchaseController = new PurchaseController(purchaseApi);
