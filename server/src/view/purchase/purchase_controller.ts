import { Request, Response } from "express";
import { BadRequest, Failure } from "../../common/error";
import { purchaseListSchema } from "../../feature/purchase/purchase_type";
import { purchase } from "../service";

export async function list(req: Request, res: Response) {
  try {
    const param = await purchaseListSchema.validate(req.query).catch((e) => {
      throw new BadRequest(e.message);
    });

    const result = await purchase.purchaseList(param);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
}
