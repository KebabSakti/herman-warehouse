import crypto from "crypto";
import dayjs from "dayjs";
import { Request } from "express";
import path from "path";
import sharp from "sharp";

export function hmac(data: string, secret: string): string {
  const signature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex");

  return signature;
}

export async function uploadFile(
  file: Express.Multer.File,
  name: string,
  dir: string = "/static"
): Promise<string> {
  const target = path.join(process.cwd(), dir);
  const { buffer } = file;

  await sharp(buffer)
    .jpeg({ quality: 70 })
    .resize(800)
    .toFile(path.join(target, name));

  return name;
}

export function getPostDataType(req: Request): string | undefined {
  const contentType = req.headers["content-type"];

  if (contentType?.includes("application/json")) {
    return "json";
  }

  if (contentType?.includes("application/x-www-form-urlencoded")) {
    return "string";
  }

  if (contentType?.includes("multipart/form-data")) {
    return "formdata";
  }
}

export function parsePaylod(req: Request): string | undefined {
  let payload;
  const contentType = getPostDataType(req);

  if (contentType == "json") {
    payload = JSON.stringify(req.body);
  }

  if (contentType == "string") {
    payload = req.body;
  }

  if (contentType == "formdata") {
    payload = req.body.payload;
  }

  return payload;
}

export function now() {
  return dayjs.utc().format("YYYY-MM-DD HH:mm:ss");
}
