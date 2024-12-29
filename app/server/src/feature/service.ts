import { InvoiceController } from "./invoice/controller/invoice_controller";
import { InvoiceApi } from "./invoice/model/invoice_api";
import { InvoiceMysql } from "./invoice/model/invoice_mysql";
import { ProductController } from "./product/controller/product_controller";
import { ProductApi } from "./product/model/product_api";
import { ProductMysql } from "./product/model/product_mysql";
import { PurchaseController } from "./purchase/controller/purchase_controller";
import { PurchaseApi } from "./purchase/model/purchase_api";
import { PurchaseMysql } from "./purchase/model/purchase_mysql";
import { SupplierController } from "./supplier/controller/supplier_controller";
import { SupplierApi } from "./supplier/model/supplier_api";
import { SupplierMysql } from "./supplier/model/supplier_mysql";
import { UserController } from "./user/controller/user_controller";
import { UserApi } from "./user/model/user_api";
import { UserMysql } from "./user/model/user_mysql";

const userApi: UserApi = new UserMysql();
const productApi: ProductApi = new ProductMysql();
const supplierApi: SupplierApi = new SupplierMysql();
const purchaseApi: PurchaseApi = new PurchaseMysql();
const invoiceApi: InvoiceApi = new InvoiceMysql();

export const userController = new UserController(userApi);
export const productController = new ProductController(productApi);
export const supplierController = new SupplierController(supplierApi);
export const purchaseController = new PurchaseController(purchaseApi);
export const invoiceController = new InvoiceController(invoiceApi);
