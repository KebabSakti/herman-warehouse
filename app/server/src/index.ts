import cors from "cors";
import express from "express";
import http from "http";
import multer from "multer";
import { Failure } from "./common/error";
import { isLogin } from "./feature/middleware";
import productRoute from "./feature/product/view/product_route";
import supplierRoute from "./feature/supplier/view/supplier_route";
import purchaseRoute from "./feature/purchase/view/purchase_route";
import userRoute from "./feature/user/view/user_route";
import { MySql } from "./helper/mysql";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

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

    // for await (let _ of [...Array(200)]) {
    // }

    // const a = new PurchaseRepository();
    // const b = await a.purchaseDetail(req.params.id);

    // const query = await MySql.query(
    //   "select purchases.*, inventories.productName, inventories.qty, inventories.price, inventories.total from purchases left join inventories on purchases.id = inventories.purchaseId"
    // );

    const table = `(select * from purchases where deleted is null order by created asc limit 2 offset 0) as purchases`;

    let query = `
    select purchases.*, inventories.*, payments.*
    from ${table}
    left join inventories on purchases.id = inventories.purchaseId
    left join payments on purchases.id = payments.purchaseId
    `;

    const purchases = await MySql.query({ sql: query, nestTables: true });

    const result = purchases.reduce((acc: any, item: any) => {
      let index = acc.findIndex((e: any) => e.id == item.purchases.id);

      if (index >= 0) {
        const invIndex = acc[index].inventory.findIndex(
          (e: any) => e.id == item.inventories.id
        );

        const payIndex = acc[index].payment.findIndex(
          (e: any) => e.id == item.payments.id
        );

        if (invIndex < 0) {
          if (item.inventories.id != null) {
            acc[index].inventory.push(item.inventories);
          }
        }

        if (payIndex < 0) {
          if (item.payments.id != null) {
            acc[index].payment.push(item.payments);
          }
        }
      } else {
        const element = { ...item.purchases, inventory: [], payment: [] };

        if (item.inventories.id != null) {
          element.inventory.push(item.inventories);
        }

        if (item.payments.id != null) {
          element.payment.push(item.payments);
        }

        acc.push(element);
      }

      return acc;
    }, []);

    // const result = [];

    // const query2 = await MySql.query(
    //   "select * from purchases where deleted is null limit 10 offset 0"
    // );

    // for await (const item of query2) {
    //   const i = await MySql.query(
    //     "select * from inventories where purchaseId = ?",
    //     item.id
    //   );

    //   const p = await MySql.query(
    //     "select * from payments where purchaseId = ?",
    //     item.id
    //   );

    //   result.push({ ...item, inventory: i, payment: p });
    // }

    console.log(result.length);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

app.use("/", userRoute);
app.use("/app", isLogin);
app.use("/app/product", productRoute);
app.use("/app/supplier", supplierRoute);
app.use("/app/purchase", purchaseRoute);

//route not found 404
app.use("*", (_, res) => res.status(404).json("Route path not found"));

server.listen(port);
