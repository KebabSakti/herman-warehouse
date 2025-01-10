import cors from "cors";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import express from "express";
import http from "http";
import multer from "multer";
import { Failure } from "./common/error";
import customerRoute from "./feature/customer/view/customer_route";
import installmentRoute from "./feature/installment/view/installment_route";
import invoiceRoute from "./feature/invoice/view/invoice_route";
import ledgerRoute from "./feature/ledger/view/ledger_route";
import { isLogin, isSigned } from "./feature/middleware";
import productRoute from "./feature/product/view/product_route";
import purchaseRoute from "./feature/purchase/view/purchase_route";
import stockRoute from "./feature/stock/view/stock_route";
import supplierRoute from "./feature/supplier/view/supplier_route";
import userRoute from "./feature/user/view/user_route";

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

app.get("/", async (req, res) => {
  try {
    const localStartDate = "2025-01-10T00:00:00";
    const localEndDate = "2025-01-10T23:59:59";
    const utcStartDate = dayjs
      .tz(localStartDate, "Asia/Kuala_Lumpur")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");
    const utcEndDate = dayjs
      .tz(localEndDate, "Asia/Kuala_Lumpur")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    console.log(utcStartDate.toString());
    console.log(utcEndDate.toString());

    return res.json("OKE");
  } catch (error: any) {
    return Failure(error, res);
  }
});

//route not found 404
app.use("*", (_, res) => res.status(404).json("Route path not found"));

server.listen(port);
