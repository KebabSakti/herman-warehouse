import { Request, Response } from "express";
import { BadRequest, Failure } from "../../../common/error";
import { purchase } from "../../../view/service";
import {
  purchaseCreateSchema,
  purchaseListSchema,
} from "../model/purchase_type";

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

export async function create(req: Request, res: Response) {
  try {
    const param = await purchaseCreateSchema.validate(req.body).catch((e) => {
      throw new BadRequest(e.message);
    });

    await purchase.purchaseCreate(param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
}

export async function read(req: Request, res: Response) {
  try {
    const result = await purchase.purchaseRead(req.params.id);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
}
