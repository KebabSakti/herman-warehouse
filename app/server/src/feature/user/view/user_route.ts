import express from "express";
import { Failure, Unauthorized } from "../../../common/error";
import { userLoginSchema } from "../model/user_type";
import { userController } from "../../service";

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

export default router;
