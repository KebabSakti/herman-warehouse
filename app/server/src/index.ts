import cors from "cors";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import express from "express";
import http from "http";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import { Failure } from "./common/error";
import customerRoute from "./feature/customer/view/customer_route";
import invoiceRoute from "./feature/invoice/view/invoice_route";
import { isLogin, isSigned } from "./feature/middleware";
import productRoute from "./feature/product/view/product_route";
import purchaseRoute from "./feature/purchase/view/purchase_route";
import stockRoute from "./feature/stock/view/stock_route";
import supplierRoute from "./feature/supplier/view/supplier_route";
import userRoute from "./feature/user/view/user_route";
import installmentRoute from "./feature/installment/view/installment_route";

dayjs.extend(utc);

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

app.get("/", (req, res) => {
  console.log(req.body);
  return res.end();
});

app.use("/", userRoute);
app.use("/app", isLogin, isSigned);
app.use("/app/product", productRoute);
app.use("/app/supplier", supplierRoute);
app.use("/app/purchase", purchaseRoute);
app.use("/app/invoice", invoiceRoute);
app.use("/app/stock", stockRoute);
app.use("/app/customer", customerRoute);
app.use("/app/installment", installmentRoute);

app.post("/app/test", async (req, res) => {
  try {
    // const { data, signature } = req.body;
    // const token = res.locals.token;
    // const recalculatedSignature = hmac(data, token);

    // if (recalculatedSignature !== signature) {
    //   throw new BadRequest("Signature not match");
    // }

    if (req.files) {
      const target = path.join(process.cwd(), "/static");
      const files = req.files as Express.Multer.File[];
      const { buffer, originalname } = files[0];
      const fileName = randomUUID() + originalname;

      await sharp(buffer)
        .jpeg({ quality: 70 })
        .resize(800)
        .toFile(path.join(target, fileName));
    }

    return res.json("OKE");
  } catch (error: any) {
    return Failure(error, res);
  }
});

//route not found 404
app.use("*", (_, res) => res.status(404).json("Route path not found"));

server.listen(port);
