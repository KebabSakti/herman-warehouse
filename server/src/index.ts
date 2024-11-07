import cors from "cors";
import express from "express";
import http from "http";
import multer from "multer";
import { MySql } from "./helper/mysql";
import authRoute from "./view/auth/auth_route";
import { isLogin } from "./view/middleware";
import { ProductRepository } from "./feature/product/product_repository";
import { number, object, string } from "yup";
import { BadRequest, Failure } from "./common/error";

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
  // for await (let _ of [...Array(100)]) {
  //   MySql.query("insert into products set ?", {
  //     code: faker.string.uuid(),
  //     name: faker.commerce.productName(),
  //     created: new Date(),
  //     updated: new Date(),
  //   });
  // }

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
    console.log(req.query);

    const schema = object({
      page: number().required(),
      limit: number().required(),
    });

    const parsed = await schema.validate(req.query).catch((_) => {
      throw new BadRequest();
    });

    const productRepos = new ProductRepository();
    const data = await productRepos.list(parsed);

    return res.json(data);
  } catch (error: any) {
    return Failure(error, res);
  }
});

app.use("/", authRoute);
app.use("/app", isLogin);

//route not found 404
app.use("*", (_, res) => res.status(404).json("Route path not found"));

server.listen(port);
