import { faker } from "@faker-js/faker";
import cors from "cors";
import express from "express";
import http from "http";
import multer from "multer";
import { Failure } from "./common/error";
import { MySql } from "./helper/mysql";
import authRoute from "./view/auth/auth_route";
import { isLogin } from "./view/middleware";
import productRoute from "./view/product/product_route";
import purchaseRoute from "./view/purchase/purchase_route";

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
  // const userApi = new UserMysql();
  // const user = await userApi.read(req.params.id);
  // const token = await auth.login(req.body.uid, req.body.password);

  // const page = 1;
  // const limit = 10;
  // const offset = (page - 1) * limit;

  // const products = await MySql.query(
  //   "select * from products order by name asc limit ? offset ?",
  //   [limit, offset]
  // );

  // const data = {
  //   data: products,
  //   paging: {
  //     page: page,
  //     limit: limit,
  //     total: 100,
  //   },
  // };

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

    for await (let _ of [...Array(200)]) {
      // const user = await MySql.query("select * from users order by rand()");
      const supp = await MySql.query("select * from suppliers order by rand()");

      // await MySql.query("insert into purchases set ?", {
      //   id: faker.string.uuid(),
      //   userId: user[0].id,
      //   userName: user[0].name,
      //   userPhone: user[0].phone,
      //   supplierId: supp[0].id,
      //   supplierName: supp[0].name,
      //   supplierPhone: supp[0].phone,
      //   supplierAddress: supp[0].address,
      //   supplierNote: supp[0].note,
      //   code: faker.string.uuid(),
      //   fee: faker.commerce.price(),
      //   total: faker.commerce.price(),
      //   paid: faker.commerce.price(),
      //   balance: faker.commerce.price(),
      //   due: faker.date.soon(),
      //   printed: faker.date.anytime(),
      //   created: faker.date.anytime(),
      //   updated: faker.date.anytime(),
      // });

      // const purchase = await MySql.query(
      //   "select * from purchases order by rand()"
      // );

      const product = await MySql.query(
        "select * from products order by rand()"
      );

      await MySql.query("insert into stocks set ?", {
        id: faker.string.uuid(),
        supplierId: supp[0].id,
        productId: product[0].id,
        qty: faker.commerce.price(),
        price: faker.commerce.price(),
        created: faker.date.anytime(),
        updated: faker.date.anytime(),
      });
    }

    return res.json("OKE");
  } catch (error: any) {
    return Failure(error, res);
  }
});

app.use("/", authRoute);
app.use("/app", isLogin);
app.use("/app/product", productRoute);
app.use("/app/purchase", purchaseRoute);

//route not found 404
app.use("*", (_, res) => res.status(404).json("Route path not found"));

server.listen(port);
