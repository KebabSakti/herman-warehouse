import jwt from "jsonwebtoken";
import { SignerApi } from "../api/signer_api";
import { SignerModel, SignerSignParam } from "../model/signer_model";

export class SignerJwt implements SignerApi {
  async sign(param: SignerSignParam): Promise<string> {
    const signed = jwt.sign(param, process.env.UUID!);

    return signed;
  }

  async verify(token: string): Promise<SignerModel | null | undefined> {
    const result = jwt.verify(token, process.env.UUID!);
    const model = result as SignerModel;

    return model;
  }
}
