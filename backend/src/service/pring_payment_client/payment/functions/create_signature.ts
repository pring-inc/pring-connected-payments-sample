import { sha256Digest } from "../../../../generic/digests";
import { PringPaymentClientConfig } from "../../config";

export function createSignature(
  config: PringPaymentClientConfig,
  components: readonly string[]
) {
  const { clientSecret } = config.attrs;
  const joined = [...components, clientSecret].join("&");
  const digested = sha256Digest(joined);
  return digested;
}
