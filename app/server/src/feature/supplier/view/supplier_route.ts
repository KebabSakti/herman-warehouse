import express from "express";
import { BadRequest, Failure } from "../../../common/error";
import {
  supplierCreateSchema,
  supplierListSchema,
  supplierUpdateSchema,
} from "../model/supplier_type";
import { supplierController } from "../../service";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const param = await supplierCreateSchema.validate(req.body).catch((_) => {
      throw new BadRequest();
    });

    await supplierController.create(param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await supplierController.read(req.params.id);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const param = await supplierUpdateSchema.validate(req.body).catch((_) => {
      throw new BadRequest();
    });

    await supplierController.update(req.params.id, param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await supplierController.remove(req.params.id);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.get("/", async (req, res) => {
  try {
    const param = await supplierListSchema.validate(req.query).catch((e) => {
      throw new BadRequest(e.message);
    });

    const result = await supplierController.list(param);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

export default router;
