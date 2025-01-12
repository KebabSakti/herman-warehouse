import express from "express";
import { Failure } from "../../../common/error";
import { profitController } from "../../service";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await profitController.list(req.query as any);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
});

export default router;