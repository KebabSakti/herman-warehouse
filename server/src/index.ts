import cors from "cors";
import express from "express";
import http from "http";
import multer from "multer";
import { MySql } from "./helper/mysql";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";
import { UserMysql } from "./feature/auth/usecase/user_mysql";

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

app.get("/:id", async (req, res) => {
  // for await (let _ of [...Array(100)]) {
  //   MySql.query("insert into products set ?", {
  //     code: faker.string.uuid(),
  //     name: faker.commerce.productName(),
  //     created: new Date(),
  //     updated: new Date(),
  //   });
  // }

  const userApi = new UserMysql();
  const user = await userApi.read(req.params.id);

  return res.json(user);
});

//route not found 404
app.use("*", (_, res) => res.status(404).json("Route path not found"));

server.listen(port);
