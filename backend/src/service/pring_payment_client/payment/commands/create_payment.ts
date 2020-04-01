import { PringPaymentClientContext } from "../../context";
import { ServerResponseParseError } from "../../__common__/models/response/server_response_parse_error";
import { UnexpectedErrorResponseError } from "../../__common__/models/response/unexpected_error_response_error";
import { ApiResponse } from "../../__common__/models/utility/api_response";
import { CreatePayment } from "../model/request/create_payment";
import { Payment } from "../model/response/payment";
import { createSignature } from "../functions/create_signature";
import { requestWithAuthorization } from "../../__common__/functions/request_with_authorization";
import { AuthorizationExpiredError } from "../../__common__/models/response/authorization_expired_error";
import { Authorization } from "../../__common__/models/response/authorization";
import { ErrorSummary } from "../../__common__/models/utility/error_summary";

export async function createPayment(
  context: PringPaymentClientContext,
  request: CreatePayment
): Promise<
  [
    (
      | Payment
      | ServerResponseParseError
      | AuthorizationExpiredError
      | UnexpectedErrorResponseError
    ),
    Authorization
  ]
> {
  const { config } = context;
  const signature = createSignature(config, [
    request.params.amount.toString(),
    request.params.transactionId
  ]);
  const [response, newAuthorization] = await requestWithAuthorization(context, {
    authorization: request.params.authorization,
    method: "POST",
    path: "/payments",
    body: {
      amount: request.params.amount,
      client_transaction_id: request.params.transactionId,
      signature
    }
  });
  if (!(response instanceof ApiResponse)) {
    return [interpretError(response), newAuthorization];
  }
  return [Payment.fromApiResponse(response), newAuthorization];
}

function interpretError(
  error:
    | ErrorSummary
    | ServerResponseParseError
    | AuthorizationExpiredError
    | UnexpectedErrorResponseError
):
  | ServerResponseParseError
  | AuthorizationExpiredError
  | UnexpectedErrorResponseError {
  if (
    error instanceof ServerResponseParseError ||
    error instanceof AuthorizationExpiredError ||
    error instanceof UnexpectedErrorResponseError
  ) {
    return error;
  }
  return new UnexpectedErrorResponseError(error);
}
