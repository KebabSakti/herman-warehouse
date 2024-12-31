import express from "express";
import { BadRequest, Failure } from "../../../common/error";
import { stockController } from "../../service";
import { stockListSchema, stockCreateSchema } from "../model/stock_type";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const param = await stockListSchema.validate(req.query).catch((e) => {
      throw new BadRequest(e.message);
    });

    const result = await stockController.list(param);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const param = await stockCreateSchema.validate(req.body).catch((e) => {
      throw new BadRequest(e.message);
    });

    await stockController.create(param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await stockController.read(req.params.id);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await stockController.remove(req.params.id);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

export default router;
