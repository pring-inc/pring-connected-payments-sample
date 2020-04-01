import forge from "node-forge";
import { PringPaymentClientConfig } from "../../config";

const AES_ENCRYPTION_IV = "PRING-EX-PAYMENT";

export function encryptString(
  config: PringPaymentClientConfig,
  plaintext: string
): string {
  const { clientSecret } = config.attrs;
  const cipher = forge.cipher.createCipher("AES-CBC", clientSecret);
  cipher.start({ iv: AES_ENCRYPTION_IV });
  cipher.update(forge.util.createBuffer(plaintext));
  cipher.finish();
  const encoded = forge.util.encode64(cipher.output.getBytes());
  return encoded;
}
