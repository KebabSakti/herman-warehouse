import { Request, Response } from "express";
import { object, string } from "yup";
import { BadRequest, Failure, Unauthorized } from "../../common/error";
import { auth } from "../service";

export async function login(req: Request, res: Response) {
  try {
    const schema = object({
      uid: string().required(),
      password: string().required(),
    });

    const valid = await schema.isValid(req.body);

    if (!valid) {
      throw new BadRequest();
    }

    const token = await auth.login(req.body.uid, req.body.password);

    if (token != undefined) {
      return res.json({ token: token });
    }

    throw new Unauthorized();
  } catch (error: any) {
    return Failure(error, res);
  }
}

export async function reset(req: Request, res: Response) {
  try {
    // const token = await auth.login(req.body.username, req.body.password);
    // if (token != undefined) {
    //   return res.json({ token: token });
    // }
    // throw new Unauthorized();
  } catch (error: any) {
    return Failure(error, res);
  }
}
