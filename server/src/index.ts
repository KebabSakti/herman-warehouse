import cors from "cors";
import express from "express";
import http from "http";
import multer from "multer";
import { auth } from "./view/service";
import { isLogin, isOwner } from "./view/middleware";

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

app.post("/", async (req, res) => {
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

  const token = await auth.login(req.body.uid, req.body.password);

  return res.json(token);
});

app.use("/", isLogin);

app.get("/", (req, res) => {
  console.log(res.locals.auth);

  return res.json("LOGIN PASSED");
});

app.use("/owner", isOwner);
app.get("/owner", (req, res) => {
  return res.json("OWNER PASSED");
});

//route not found 404
app.use("*", (_, res) => res.status(404).json("Route path not found"));

server.listen(port);
