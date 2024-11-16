import express from "express";
import { BadRequest, Failure } from "../../../common/error";
import {
  purchaseCreateSchema,
  purchaseListSchema,
} from "../model/purchase_type";
import { purchaseController } from "../../service";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const param = await purchaseListSchema.validate(req.query).catch((e) => {
      throw new BadRequest(e.message);
    });

    const result = await purchaseController.list(param);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const param = await purchaseCreateSchema.validate(req.body).catch((e) => {
      throw new BadRequest(e.message);
    });

    await purchaseController.create(param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await purchaseController.read(req.params.id);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

export default router;
