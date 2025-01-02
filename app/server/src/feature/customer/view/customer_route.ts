import express from "express";
import { BadRequest, Failure } from "../../../common/error";
import { customerController } from "../../service";
import {
  customerListSchema,
  customerCreateSchema,
} from "../model/customer_type";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const param = await customerListSchema.validate(req.query).catch((e) => {
      throw new BadRequest(e.message);
    });

    const result = await customerController.list(param);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const param = await customerCreateSchema.validate(req.body).catch((e) => {
      throw new BadRequest(e.message);
    });

    await customerController.create(param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await customerController.read(req.params.id);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const param = await customerCreateSchema.validate(req.body).catch((e) => {
      throw new BadRequest(e.message);
    });

    await customerController.update(req.params.id, param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await customerController.remove(req.params.id);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

export default router;
