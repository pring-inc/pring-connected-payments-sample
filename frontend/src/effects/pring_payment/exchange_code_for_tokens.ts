import {PringPaymentClientContext} from 'pring-payment-demo-backend/dist/service/pring_payment_client/context';
import {Authorization} from 'pring-payment-demo-backend/dist/service/pring_payment_client/__common__/models/response/authorization';
import {exchangeCodeForAuthorization} from 'pring-payment-demo-backend/dist/service/pring_payment_client/authorization/commands/exchange_code_for_authorization';

export async function exchangeCodeForTokens(
  context: PringPaymentClientContext,
  code: string,
): Promise<Authorization> {
  const result = await exchangeCodeForAuthorization(context, code);
  if (!(result instanceof Authorization)) {
    throw result;
  }
  return result;
}
