import express from "express";
import { BadRequest, Failure } from "../../../common/error";
import { purchaseController } from "../../service";
import {
  purchaseCreateSchema,
  purchaseListSchema,
} from "../model/purchase_type";
import { fileSchema } from "../../../common/type";
import { uploadFile } from "../../../helper/util";

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
    const param = req.body;

    if (param.ledger && param.ledger.length > 0 && param.ledger[0].file) {
      const files = req.files as Express.Multer.File[] | undefined;

      for (let i = 0; i < param.ledger.length; i++) {
        if (files && files[i]) {
          await fileSchema
            .validate(files[i])
            .then(async () => {
              await uploadFile(files[i], param.ledger[i].id + ".jpg");
            })
            .catch((e) => {
              throw new BadRequest(e.message);
            });
        }
      }
    }

    await purchaseCreateSchema.validate(param).catch((e) => {
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

router.delete("/:id", async (req, res) => {
  try {
    await purchaseController.remove(req.params.id);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

export default router;
