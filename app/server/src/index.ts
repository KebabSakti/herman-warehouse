import cors from "cors";
import express from "express";
import http from "http";
import multer from "multer";
import { Failure } from "./common/error";
import { isLogin } from "./feature/middleware";
import productRoute from "./feature/product/view/product_route";
import purchaseRoute from "./feature/purchase/view/purchase_route";
import userRoute from "./feature/user/view/user_route";

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

app.get("/", async (req, res) => {
  try {
    // await MySql.transaction(async (connection) => {
    //   await new Promise((resolve, reject) => {
    //     connection.query(
    //       "insert into suppliers set ?",
    //       [{ id: "c", name: "tiga" }],
    //       (err, res) => {
    //         if (err) reject(err);
    //         resolve(res);
    //       }
    //     );
    //   });

    //   await new Promise((resolve, reject) => {
    //     connection.query(
    //       "insert into suppliers set ?",
    //       [{ id: "d", name: "empat" }],
    //       (err, res) => {
    //         if (err) reject(err);
    //         resolve(res);
    //       }
    //     );
    //   });
    // });

    // const a = await MySql.query(
    //   "select users.*,activities.description,activities.created from users right join activities on users.id = activities.userId"
    // );

    // for await (let _ of [...Array(200)]) {
    // }

    // const a = new PurchaseRepository();
    // const b = await a.purchaseDetail(req.params.id);

    console.log("OKE");

    return res.json("OKE");
  } catch (error: any) {
    return Failure(error, res);
  }
});

app.use("/", userRoute);
app.use("/app", isLogin);
app.use("/app/product", productRoute);
app.use("/app/purchase", purchaseRoute);

//route not found 404
app.use("*", (_, res) => res.status(404).json("Route path not found"));

server.listen(port);
