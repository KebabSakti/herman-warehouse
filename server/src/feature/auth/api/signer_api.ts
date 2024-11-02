import { SignerModel, SignerSignParam } from "../model/signer_model";

export abstract class SignerApi {
  abstract sign(param: SignerSignParam): Promise<string>;
  abstract verify(token: string): Promise<SignerModel | null | undefined>;
}
