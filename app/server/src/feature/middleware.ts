import { NextFunction, Request, Response } from "express";
import { BadRequest, Failure, Unauthorized } from "../common/error";
import { hmac, parsePaylod } from "../helper/util";
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
          res.locals.token = token;

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

export async function isSigned(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.method == "GET") {
      return next();
    } else {
      const payload = parsePaylod(req);

      if (payload && payload.length > 0) {
        const signature = req.headers["x-signature"];
        const serverSignature = hmac(payload, res.locals.token);

        if (serverSignature == signature) {
          req.body = JSON.parse(payload);
        } else {
          throw new BadRequest("Parameter compromise");
        }
      }

      return next();
    }
  } catch (error: any) {
    return Failure(error, res);
  }
}

export async function logger(req: Request, res: Response, next: NextFunction) {
  const method = req.method;
  const headers = req.headers;
  const path = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const body = req.body;

  console.log(" ");
  console.log("METHOD : " + method);
  console.log("PATH : " + path);

  if (Object.keys(req.body).length > 0) {
    console.log("BODY");
    console.log(body);
  }

  if (req.files) {
    console.log("FILE");
    console.log(req.files);
  }

  console.log("HEADERS");
  console.log(headers);

  return next();
}
