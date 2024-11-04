import cors from "cors";
import express from "express";
import http from "http";
import multer from "multer";
import authRoute from "./view/auth/auth_route";
import { isLogin } from "./view/middleware";

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

  return res.json({ hello: "world" });
});

app.use("/", authRoute);
app.use("/app", isLogin);

//route not found 404
app.use("*", (_, res) => res.status(404).json("Route path not found"));

server.listen(port);
