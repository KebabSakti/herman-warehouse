import express from "express";
import { BadRequest, Failure } from "../../../common/error";
import { fileSchema } from "../../../common/type";
import { uploadFile } from "../../../helper/util";
import { installmentController } from "../../service";
import {
  installmentCreateSchema,
  installmentListSchema,
} from "../model/installment_types";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const payload = req.body;

    await installmentCreateSchema
      .validate(payload, { strict: false })
      .catch((_) => {
        throw new BadRequest();
      });

    if (payload.attachment) {
      const files = req.files as Express.Multer.File[] | undefined;

      if (files) {
        await fileSchema
          .validate(files[0], { strict: false })
          .then(async () => {
            await uploadFile(files[0], payload.attachment);
          })
          .catch((e) => {
            throw new BadRequest(e.message);
          });
      }
    }

    await installmentController.create(payload);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await installmentController.remove(req.params.id);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.get("/:invoiceId", async (req, res) => {
  try {
    const query = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
    };

    await installmentListSchema
      .validate(query, { strict: false })
      .catch((e) => {
        throw new BadRequest(e.message);
      });

    const result = await installmentController.list(
      req.params.invoiceId,
      query
    );

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

export default router;
