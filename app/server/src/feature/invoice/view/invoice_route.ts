import express from "express";
import { BadRequest, Failure } from "../../../common/error";
import { fileSchema } from "../../../common/type";
import { hmac, uploadFile } from "../../../helper/util";
import { invoiceController } from "../../service";
import { invoiceCreateSchema, invoiceListSchema } from "../model/invoice_type";

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
    const param = req.body;

    await invoiceCreateSchema.validate(param, { strict: false }).catch((e) => {
      throw new BadRequest(e.message);
    });

    if (param.installment) {
      const files = req.files as Express.Multer.File[] | undefined;

      for (let i = 0; i < param.installment.length; i++) {
        if (files && files[i]) {
          await fileSchema
            .validate(files[i], { strict: false })
            .then(async () => {
              await uploadFile(files[i], param.installment[i].attachment);
            })
            .catch((e) => {
              throw new BadRequest(e.message);
            });
        }
      }
    }

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
