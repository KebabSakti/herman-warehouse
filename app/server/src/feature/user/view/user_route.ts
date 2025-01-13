import express from "express";
import { BadRequest, Failure, Unauthorized } from "../../../common/error";
import { userController } from "../../service";
import {
  userCreateSchema,
  userLoginSchema,
  userUpdateSchema,
} from "../model/user_type";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const param = await userLoginSchema.validate(req.body).catch(() => {
      throw new Unauthorized();
    });

    const token = await userController.login(param);

    if (token != null) {
      return res.json({ token: token });
    }

    throw new Unauthorized();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.get("/user", async (req, res) => {
  try {
    const results = await userController.list(req.query as any);

    return res.json(results);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const results = await userController.read(req.params.id);

    return res.json(results);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.post("/user", async (req, res) => {
  try {
    const param = await userCreateSchema.validate(req.body).catch(() => {
      throw new Unauthorized();
    });

    await userController.create(param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.put("/user/:id", async (req, res) => {
  try {
    const param = await userUpdateSchema.validate(req.body).catch(() => {
      throw new BadRequest();
    });

    await userController.update(req.params.id, param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    await userController.remove(req.params.id);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

export default router;
