import { CreditController } from "./credit/controller/credit_controller";
import { CreditApi } from "./credit/model/credit_api";
import { CreditMysql } from "./credit/model/credit_mysql";
import { CustomerController } from "./customer/controller/customer_controller";
import { CustomerApi } from "./customer/model/customer_api";
import { CustomerMysql } from "./customer/model/customer_mysql";
import { DashboardController } from "./dashboard/controller/dashboard_controller";
import { DashboardApi } from "./dashboard/model/dashboard_api";
import { DashboardMysql } from "./dashboard/model/dashboard_mysql";
import { ExpenseController } from "./expense/controller/expense_controller";
import { ExpenseApi } from "./expense/model/expense_api";
import { ExpenseMysql } from "./expense/model/expense_mysql";
import { InstallmentController } from "./installment/controller/installment_controller";
import { InstallmentApi } from "./installment/model/installment_api";
import { InstallmentMysql } from "./installment/model/installment_mysql";
import { InvoiceController } from "./invoice/controller/invoice_controller";
import { InvoiceApi } from "./invoice/model/invoice_api";
import { InvoiceMysql } from "./invoice/model/invoice_mysql";
import { LedgerController } from "./ledger/controller/ledger_controller";
import { LedgerApi } from "./ledger/model/ledger_api";
import { LedgerMysql } from "./ledger/model/ledger_mysql";
import { OutstandingController } from "./outstanding/controller/outstanding_controller";
import { OutstandingApi } from "./outstanding/model/outstanding_api";
import { OutstandingMysql } from "./outstanding/model/outstanding_mysql";
import { ProductController } from "./product/controller/product_controller";
import { ProductApi } from "./product/model/product_api";
import { ProductMysql } from "./product/model/product_mysql";
import { ProfitController } from "./profit/controller/profit_controller";
import { ProfitApi } from "./profit/model/profit_api";
import { ProfitMysql } from "./profit/model/profit_mysql";
import { PurchaseController } from "./purchase/controller/purchase_controller";
import { PurchaseApi } from "./purchase/model/purchase_api";
import { PurchaseMysql } from "./purchase/model/purchase_mysql";
import { SaleController } from "./sale/controller/sale_controller";
import { SaleApi } from "./sale/model/sale_api";
import { SaleMysql } from "./sale/model/sale_mysql";
import { StockController } from "./stock/controller/stock_controller";
import { StockApi } from "./stock/model/stock_api";
import { StockMysql } from "./stock/model/stock_mysql";
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
const stockApi: StockApi = new StockMysql();
const customerApi: CustomerApi = new CustomerMysql();
const installmentApi: InstallmentApi = new InstallmentMysql();
const ledgerApi: LedgerApi = new LedgerMysql();
const saleApi: SaleApi = new SaleMysql();
const outstandingApi: OutstandingApi = new OutstandingMysql();
const creditApi: CreditApi = new CreditMysql();
const profitApi: ProfitApi = new ProfitMysql();
const expenseApi: ExpenseApi = new ExpenseMysql();
const dashboardApi: DashboardApi = new DashboardMysql();

export const userController = new UserController(userApi);
export const productController = new ProductController(productApi);
export const supplierController = new SupplierController(supplierApi);
export const purchaseController = new PurchaseController(purchaseApi);
export const invoiceController = new InvoiceController(invoiceApi);
export const stockController = new StockController(stockApi);
export const customerController = new CustomerController(customerApi);
export const installmentController = new InstallmentController(installmentApi);
export const ledgerController = new LedgerController(ledgerApi);
export const saleController = new SaleController(saleApi);
export const outstandingController = new OutstandingController(outstandingApi);
export const creditController = new CreditController(creditApi);
export const profitController = new ProfitController(profitApi);
export const expenseController = new ExpenseController(expenseApi);
export const dashboardController = new DashboardController(dashboardApi);
