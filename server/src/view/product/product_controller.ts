import { Request, Response } from "express";
import { object, number } from "yup";
import { BadRequest, Unauthorized, Failure } from "../../common/error";
import { auth, product } from "../service";
import { productListSchema } from "../../feature/product/product_type";

export async function list(req: Request, res: Response) {
  try {
    const params = await productListSchema.validate(req.params);
    const result = await product.list(params);

    return res.json(result);
  } catch (error: any) {
    return Failure(error, res);
  }
}
