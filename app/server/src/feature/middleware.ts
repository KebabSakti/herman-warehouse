import { NextFunction, Request, Response } from "express";
import { Failure, Unauthorized } from "../common/error";
import { userController } from "./service";

export async function isLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;

    if (authorization != undefined) {
      const payloads = authorization.split(" ");

      if (payloads.length == 2) {
        const token = payloads[1];
        const user = await userController.validate(token);

        if (user != null) {
          res.locals.user = user;

          return next();
        }
      }
    }

    throw new Unauthorized();
  } catch (error: any) {
    return Failure(error, res);
  }
}

export async function isOwner(req: Request, res: Response, next: NextFunction) {
  try {
    if (res.locals.user.role == "owner") {
      return next();
    }

    throw new Unauthorized();
  } catch (error: any) {
    return Failure(error, res);
  }
}
