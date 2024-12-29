import express from "express";
import { BadRequest, Failure } from "../../../common/error";
import { invoiceController } from "../../service";
import { invoiceListSchema, invoiceCreateSchema } from "../model/invoice_type";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const param = await invoiceListSchema.validate(req.query).catch((e) => {
      throw new BadRequest(e.message);
    });

    const result = await invoiceController.list(param);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const param = await invoiceCreateSchema.validate(req.body).catch((e) => {
      throw new BadRequest(e.message);
    });

    await invoiceController.create(param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await invoiceController.read(req.params.id);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await invoiceController.remove(req.params.id);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

export default router;
