import React from 'react';
import Config from 'react-native-config';
import {PringPaymentClientContext} from 'pring-payment-demo-backend/dist/service/pring_payment_client/context';
import {PringPaymentClientConfig} from 'pring-payment-demo-backend/dist/service/pring_payment_client/config';
import {PringPaymentClient} from 'pring-payment-demo-backend/dist/service/pring_payment_client/__common__/models/utility/client';

export const PringPaymentClientReactContext = React.createContext<
  PringPaymentClientContext
>(createPringPaymentClientContext());

export function createPringPaymentClientContext(): PringPaymentClientContext {
  const config = PringPaymentClientConfig.fromEnvironment(Config);
  return {
    config,
    client: new PringPaymentClient(config),
  };
}
