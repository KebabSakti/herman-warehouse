import { createContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { Middleware } from "../component/Middleware";
import { AuthController } from "../feature/authentication/controller/auth_controller";
import { AuthApi } from "../feature/authentication/model/auth_api";
import { AuthAxios } from "../feature/authentication/model/auth_axios";
import {
  AuthHookType,
  useAuthHook,
} from "../feature/authentication/view/AuthHook";
import { LoginPage } from "../feature/authentication/view/LoginPage";
import { CreditController } from "../feature/credit/controller/credit_controller";
import { CreditApi } from "../feature/credit/model/credit_api";
import { CreditAxios } from "../feature/credit/model/credit_axios";
import { CreditList } from "../feature/credit/view/CreditList";
import { CreditPrint } from "../feature/credit/view/CreditPrint";
import { CustomerController } from "../feature/customer/controller/customer_controller";
import { CustomerApi } from "../feature/customer/model/customer_api";
import { CustomerAxios } from "../feature/customer/model/customer_axios";
import { CustomerCreate } from "../feature/customer/view/CustomerCreate";
import { CustomerEdit } from "../feature/customer/view/CustomerEdit";
import { CustomerList } from "../feature/customer/view/CustomerList";
import { DashboardPage } from "../feature/dashboard/view/DashboardPage";
import { ExpenseController } from "../feature/expense/controller/expense_controller";
import { ExpenseApi } from "../feature/expense/model/expense_api";
import { ExpenseAxios } from "../feature/expense/model/expense_axios";
import { InstallmentController } from "../feature/installment/controller/installment_controller";
import { InstallmentApi } from "../feature/installment/model/installment_api";
import { InstallmentAxios } from "../feature/installment/model/installment_axios";
import { InvoiceController } from "../feature/invoice/controller/invoice_controller";
import { InvoiceApi } from "../feature/invoice/model/invoice_api";
import { InvoiceAxios } from "../feature/invoice/model/invoice_axios";
import { InstallmentPrint } from "../feature/invoice/view/InstallmentPrint";
import { InvoiceCreate } from "../feature/invoice/view/InvoiceCreate";
import { InvoiceList } from "../feature/invoice/view/InvoiceList";
import { InvoicePrint } from "../feature/invoice/view/InvoicePrint";
import { InvoiceRead } from "../feature/invoice/view/InvoiceRead";
import { LedgerController } from "../feature/ledger/controller/ledger_controller";
import { LedgerApi } from "../feature/ledger/model/ledger_api";
import { LedgerAxios } from "../feature/ledger/model/ledger_axios";
import { LedgerPrint } from "../feature/ledger/view/LedgerPrint";
import { OutstandingController } from "../feature/outstanding/controller/outstanding_controller";
import { OutstandingApi } from "../feature/outstanding/model/outstanding_api";
import { OutstandingAxios } from "../feature/outstanding/model/outstanding_axios";
import { OutstandingList } from "../feature/outstanding/view/OutstandingList";
import { OutstandingPrint } from "../feature/outstanding/view/OutstandingPrint";
import { ProductController } from "../feature/product/controller/product_controller";
import { ProductApi } from "../feature/product/model/product_api";
import { ProductAxios } from "../feature/product/model/product_axios";
import { ProductCreate } from "../feature/product/view/ProductCreate";
import { ProductEdit } from "../feature/product/view/ProductEdit";
import { ProductPage } from "../feature/product/view/ProductPage";
import { ProfitController } from "../feature/profit/controller/profit_controller";
import { ProfitApi } from "../feature/profit/model/profit_api";
import { ProfitAxios } from "../feature/profit/model/profit_axios";
import { ProfitList } from "../feature/profit/view/ProfitList";
import { ProfitPrint } from "../feature/profit/view/ProfitPrint";
import { PurchaseController } from "../feature/purchase/controller/purchase_controller";
import { PurchaseApi } from "../feature/purchase/model/purchase_api";
import { PurchaseAxios } from "../feature/purchase/model/purchase_axios";
import { PurchaseCreate } from "../feature/purchase/view/PurchaseCreate";
import { PurchaseEdit } from "../feature/purchase/view/PurchaseEdit";
import { PurchaseList } from "../feature/purchase/view/PurchaseList";
import { PurchasePrint } from "../feature/purchase/view/PurchasePrint";
import { PurchaseRead } from "../feature/purchase/view/PurchaseRead";
import { SaleController } from "../feature/sale/controller/sale_controller";
import { SaleApi } from "../feature/sale/model/sale_api";
import { SaleAxios } from "../feature/sale/model/sale_axios";
import { SaleList } from "../feature/sale/view/SaleList";
import { SalePrint } from "../feature/sale/view/SalePrint";
import { StockController } from "../feature/stock/controller/stock_controller";
import { StockApi } from "../feature/stock/model/stock_api";
import { StockAxios } from "../feature/stock/model/stock_axios";
import { SupplierController } from "../feature/supplier/controller/supplier_controller";
import { SupplierApi } from "../feature/supplier/model/supplier_api";
import { SupplierAxios } from "../feature/supplier/model/supplier_axios";
import { PurchaseListModal } from "../feature/supplier/view/PurchaseListModal";
import { SupplierCreate } from "../feature/supplier/view/SupplierCreate";
import { SupplierEdit } from "../feature/supplier/view/SupplierEdit";
import { SupplierList } from "../feature/supplier/view/SupplierList";
import { SupplierRead } from "../feature/supplier/view/SupplierRead";
import { Root } from "./Root";
import { ExpenseList } from "../feature/expense/view/ExpenseList";
import { ExpenseCreate } from "../feature/expense/view/ExpenseCreate";
import { ExpenseEdit } from "../feature/expense/view/ExpenseEdit";

export type Dependency = {
  auth: AuthHookType;
  productController: ProductController;
  supplierController: SupplierController;
  purchaseController: PurchaseController;
  invoiceController: InvoiceController;
  stockController: StockController;
  customerController: CustomerController;
  installmentController: InstallmentController;
  ledgerController: LedgerController;
  saleController: SaleController;
  outstandingController: OutstandingController;
  creditController: CreditController;
  profitController: ProfitController;
  expenseController: ExpenseController;
};

export const Dependency = createContext<Dependency | null>(null);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/print",
    children: [
      {
        path: "/print/inventory/:id",
        element: <PurchasePrint />,
      },
      {
        path: "/print/order/:id",
        element: <InvoicePrint />,
      },
      {
        path: "/print/installment/:invoiceId",
        element: <InstallmentPrint />,
      },
      {
        path: "/print/ledger/:purchaseId",
        element: <LedgerPrint />,
      },
      {
        path: "/print/sale/:start/to/:end",
        element: <SalePrint />,
      },
      {
        path: "/print/outstanding/:start/to/:end",
        element: <OutstandingPrint />,
      },
      {
        path: "/print/credit/:start/to/:end",
        element: <CreditPrint />,
      },
      {
        path: "/print/profit/:start/to/:end",
        element: <ProfitPrint />,
      },
    ],
  },
  {
    path: "/app",
    element: (
      <Middleware>
        <Root />
      </Middleware>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" />,
      },
      {
        path: "/app/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/app/inventory",
        element: <Outlet />,
        children: [
          {
            path: "/app/inventory",
            element: <PurchaseList />,
            children: [
              {
                path: "/app/inventory/read/:id",
                element: <PurchaseRead />,
              },
            ],
          },
          {
            path: "/app/inventory/create",
            element: <PurchaseCreate />,
          },
        ],
      },
      {
        path: "/app/order",
        element: <Outlet />,
        children: [
          {
            path: "/app/order",
            element: <InvoiceList />,
            children: [
              {
                path: "/app/order/read/:invoiceId",
                element: <InvoiceRead />,
              },
            ],
          },
          {
            path: "/app/order/create",
            element: <InvoiceCreate />,
          },
          {
            path: "/app/order/edit/:id",
            element: <PurchaseEdit />,
          },
        ],
      },
      {
        path: "/app/hutang",
        element: <Outlet />,
      },
      {
        path: "/app/piutang",
        element: <Outlet />,
      },
      {
        path: "/app/supplier",
        element: <Outlet />,
        children: [
          {
            path: "/app/supplier",
            element: <SupplierList />,
            children: [
              {
                path: "/app/supplier/create",
                element: <SupplierCreate />,
              },
              {
                path: "/app/supplier/edit/:id",
                element: <SupplierEdit />,
              },
            ],
          },
          {
            path: "/app/supplier/read/:id",
            element: <SupplierRead />,
            children: [
              {
                path: "/app/supplier/read/:id/inventory/read/:purchaseId",
                element: <PurchaseListModal />,
              },
            ],
          },
        ],
      },
      {
        path: "/app/customer",
        element: <Outlet />,
        children: [
          {
            path: "/app/customer",
            element: <CustomerList />,
            children: [
              {
                path: "/app/customer/create",
                element: <CustomerCreate />,
              },
              {
                path: "/app/customer/edit/:id",
                element: <CustomerEdit />,
              },
            ],
          },
        ],
      },
      {
        path: "/app/product",
        element: <ProductPage />,
        children: [
          {
            path: "/app/product/create",
            element: <ProductCreate />,
          },
          {
            path: "/app/product/edit/:id",
            element: <ProductEdit />,
          },
        ],
      },
      {
        path: "/app/expense",
        element: <ExpenseList />,
        children: [
          {
            path: "/app/expense/create",
            element: <ExpenseCreate />,
          },
          {
            path: "/app/expense/edit/:id",
            element: <ExpenseEdit />,
          },
        ],
      },
      {
        path: "/app/account",
        element: <></>,
      },
      {
        path: "/app/sales",
        element: <SaleList />,
      },
      {
        path: "/app/bill",
        element: <OutstandingList />,
      },
      {
        path: "/app/credit",
        element: <CreditList />,
      },
      {
        path: "/app/profit",
        element: <ProfitList />,
      },
      {
        path: "/app/stock",
        element: <></>,
      },
    ],
  },
]);

export function App() {
  const authApi: AuthApi = new AuthAxios();
  const productApi: ProductApi = new ProductAxios();
  const supplierApi: SupplierApi = new SupplierAxios();
  const purchaseApi: PurchaseApi = new PurchaseAxios();
  const invoiceApi: InvoiceApi = new InvoiceAxios();
  const stockApi: StockApi = new StockAxios();
  const customerApi: CustomerApi = new CustomerAxios();
  const installmentApi: InstallmentApi = new InstallmentAxios();
  const ledgerApi: LedgerApi = new LedgerAxios();
  const saleApi: SaleApi = new SaleAxios();
  const outstandingApi: OutstandingApi = new OutstandingAxios();
  const creditApi: CreditApi = new CreditAxios();
  const profitApi: ProfitApi = new ProfitAxios();
  const expenseApi: ExpenseApi = new ExpenseAxios();

  const dependencies: Dependency = {
    auth: useAuthHook(new AuthController(authApi)),
    productController: new ProductController(productApi),
    supplierController: new SupplierController(supplierApi),
    purchaseController: new PurchaseController(purchaseApi),
    invoiceController: new InvoiceController(invoiceApi),
    stockController: new StockController(stockApi),
    customerController: new CustomerController(customerApi),
    installmentController: new InstallmentController(installmentApi),
    ledgerController: new LedgerController(ledgerApi),
    saleController: new SaleController(saleApi),
    outstandingController: new OutstandingController(outstandingApi),
    creditController: new CreditController(creditApi),
    profitController: new ProfitController(profitApi),
    expenseController: new ExpenseController(expenseApi),
  };

  return (
    <Dependency.Provider value={dependencies}>
      <RouterProvider router={router} />
    </Dependency.Provider>
  );
}
