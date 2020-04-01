import { PringPaymentClient } from "./__common__/models/utility/client";
import { PringPaymentClientConfig } from "./config";

export interface PringPaymentClientContext {
  config: PringPaymentClientConfig;
  client: PringPaymentClient;
}
