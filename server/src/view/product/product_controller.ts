import { Request, Response } from "express";
import { BadRequest, Failure } from "../../common/error";
import {
  productCreateSchema,
  productListSchema,
  productUpdateSchema,
} from "../../feature/product/product_type";
import { product } from "../service";

export async function create(req: Request, res: Response) {
  try {
    const param = await productCreateSchema.validate(req.body).catch((_) => {
      throw new BadRequest();
    });

    await product.create(param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const param = await productUpdateSchema.validate(req.params).catch((_) => {
      throw new BadRequest();
    });

    await product.update(req.params.id, param);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await product.delete(req.body.id);

    return res.end();
  } catch (error: any) {
    return Failure(error, res);
  }
}

export async function list(req: Request, res: Response) {
  try {
    const param = await productListSchema.validate(req.query).catch((e) => {
      throw new BadRequest(e.message);
    });

    const result = await product.list(param);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
}
