import { EncryptorApi } from "../api/encryptor_api";
import bcrypt from "bcryptjs";

export class EncryptoBcrypt implements EncryptorApi {
  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(value, salt);

    return hashed;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(value, hash);

    return result;
  }
}
