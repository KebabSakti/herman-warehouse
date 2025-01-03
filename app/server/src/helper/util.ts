import crypto, { randomUUID } from "crypto";
import path from "path";
import sharp from "sharp";

export function hmac(data: object, secret: string): string {
  const signature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(data))
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
