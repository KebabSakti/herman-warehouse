import express from "express";
import { number, object, string } from "yup";
import { BadRequest, Failure } from "../../../common/error";
import { fileSchema } from "../../../common/type";
import { uploadFile } from "../../../helper/util";
import { expenseController } from "../../service";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await expenseController.list(req.query as any);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await expenseController.read(req.params.id);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.post("/", async (req, res) => {
  try {
    const schema = object({
      id: string().required(),
      title: string().required(),
      amount: number().required(),
      printed: string().required(),
    });

    await schema.validate(req.body).catch(() => {
      throw new BadRequest();
    });

    if (req.body.file) {
      const files = req.files as Express.Multer.File[] | undefined;

      if (files && files[0]) {
        await fileSchema
          .validate(files[0])
          .then(async () => {
            await uploadFile(files[0], req.body.id + ".jpg");
          })
          .catch((e) => {
            throw new BadRequest(e.message);
          });
      }
    }

    await expenseController.create(req.body);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const schema = object({
      id: string().required(),
      title: string().required(),
      amount: number().required(),
      printed: string().required(),
    });

    await schema.validate(req.body).catch(() => {
      throw new BadRequest();
    });

    if (req.body.file) {
      const files = req.files as Express.Multer.File[] | undefined;

      if (files && files[0]) {
        await fileSchema
          .validate(files[0])
          .then(async () => {
            await uploadFile(files[0], req.body.id + ".jpg");
          })
          .catch((e) => {
            throw new BadRequest(e.message);
          });
      }
    }

    await expenseController.update(req.params.id, req.body);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await expenseController.remove(req.params.id);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
});

export default router;
