import {PringPaymentClientContext} from 'pring-payment-demo-backend/dist/service/pring_payment_client/context';
import {Authorization} from 'pring-payment-demo-backend/dist/service/pring_payment_client/__common__/models/response/authorization';
import {CreatePayment} from 'pring-payment-demo-backend/dist/service/pring_payment_client/payment/model/request/create_payment';
import {createPayment as createPaymentApi} from 'pring-payment-demo-backend/dist/service/pring_payment_client/payment/commands/create_payment';
import {Payment} from 'pring-payment-demo-backend/dist/service/pring_payment_client/payment/model/response/payment';

export async function createPayment(
  context: PringPaymentClientContext,
  authorization: Authorization,
  amount: number,
): Promise<[Payment, Authorization]> {
  const request = new CreatePayment({
    amount,
    authorization,
    transactionId: _createTransactionId(),
  });
  const [result, newAuthorization] = await createPaymentApi(context, request);
  if (!(result instanceof Payment)) {
    throw result;
  }
  return [result, newAuthorization];
}

function _createTransactionId(): string {
  return Date.now().toString();
}
