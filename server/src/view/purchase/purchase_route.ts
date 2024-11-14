import express from "express";
import { BadRequest, Failure } from "../../common/error";
import {
  purchaseCreateSchema,
  purchaseListSchema,
} from "../../feature/purchase/purchase_type";
import { purchase } from "../service";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const param = await purchaseListSchema.validate(req.query).catch((e) => {
      throw new BadRequest(e.message);
    });

    const result = await purchase.list(param);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.post("/", async (req, res) => {
  try {
    let param = await purchaseCreateSchema.validate(req.query).catch((e) => {
      throw new BadRequest(e.message);
    });

    await purchase.create(param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

export default router;
