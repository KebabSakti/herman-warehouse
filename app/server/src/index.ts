import cors from "cors";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import express from "express";
import http from "http";
import multer from "multer";
import { Failure } from "./common/error";
import creditRoute from "./feature/credit/view/credit_route";
import customerRoute from "./feature/customer/view/customer_route";
import installmentRoute from "./feature/installment/view/installment_route";
import invoiceRoute from "./feature/invoice/view/invoice_route";
import ledgerRoute from "./feature/ledger/view/ledger_route";
import { isLogin, isSigned, logger } from "./feature/middleware";
import outstandingRoute from "./feature/outstanding/view/outstanding_route";
import productRoute from "./feature/product/view/product_route";
import purchaseRoute from "./feature/purchase/view/purchase_route";
import saleRoute from "./feature/sale/view/sale_route";
import stockRoute from "./feature/stock/view/stock_route";
import supplierRoute from "./feature/supplier/view/supplier_route";
import userRoute from "./feature/user/view/user_route";
import profitRoute from "./feature/profit/view/profit_route";
import expenseRoute from "./feature/expense/view/expense_route";
import dashboardRoute from "./feature/dashboard/view/dashboard_route";

dayjs.extend(utc);
dayjs.extend(timezone);

const app = express();
const server = http.createServer(app);
const port = 3000;

const storage = multer.memoryStorage();
const multerInstance = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./static"));
app.use(multerInstance.any());
app.use(logger);

app.use("/", userRoute);
app.use("/app", isLogin, isSigned);
app.use("/app/product", productRoute);
app.use("/app/supplier", supplierRoute);
app.use("/app/purchase", purchaseRoute);
app.use("/app/invoice", invoiceRoute);
app.use("/app/stock", stockRoute);
app.use("/app/customer", customerRoute);
app.use("/app/installment", installmentRoute);
app.use("/app/ledger", ledgerRoute);
app.use("/app/sale", saleRoute);
app.use("/app/outstanding", outstandingRoute);
app.use("/app/credit", creditRoute);
app.use("/app/profit", profitRoute);
app.use("/app/expense", expenseRoute);
app.use("/app/dashboard", dashboardRoute);

app.get("/", async (req, res) => {
  try {
    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

//route not found 404
app.use("*", (_, res) => res.status(404).json("Route path not found"));

server.listen(port);
