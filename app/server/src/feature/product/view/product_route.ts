import express from "express";
import { BadRequest, Failure } from "../../../common/error";
import { productController } from "../../service";
import {
  productCreateSchema,
  productListSchema,
  productUpdateSchema,
} from "../model/product_type";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const param = await productCreateSchema.validate(req.body).catch((_) => {
      throw new BadRequest();
    });

    await productController.create(param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await productController.read(req.params.id);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const param = await productUpdateSchema.validate(req.body).catch((_) => {
      throw new BadRequest();
    });

    await productController.update(req.params.id, param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await productController.remove(req.params.id);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.get("/", async (req, res) => {
  try {
    const param = await productListSchema.validate(req.query).catch((e) => {
      throw new BadRequest(e.message);
    });

    const result = await productController.list(param);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

export default router;
