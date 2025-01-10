import express from "express";
import { BadRequest, Failure } from "../../../common/error";
import { fileSchema } from "../../../common/type";
import { uploadFile } from "../../../helper/util";
import { ledgerController } from "../../service";
import { ledgerCreateSchema, ledgerListSchema } from "../model/ledger_type";

const router = express.Router();

router.get("/:purchaseId", async (req, res) => {
  try {
    const param = await ledgerListSchema.validate(req.query).catch((e) => {
      throw new BadRequest(e.message);
    });

    const result = await ledgerController.list(req.params.purchaseId, param);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const param = req.body;

    await ledgerCreateSchema.validate(param, { strict: false }).catch((e) => {
      throw new BadRequest(e.message);
    });

    if (param.file) {
      const files = req.files as Express.Multer.File[] | undefined;

      if (files && files[0]) {
        await fileSchema
          .validate(files[0], { strict: false })
          .then(async () => {
            await uploadFile(files[0], param.id + ".jpg");
          })
          .catch((e) => {
            throw new BadRequest(e.message);
          });
      }
    }

    await ledgerController.create(param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await ledgerController.remove(req.params.id);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

export default router;
