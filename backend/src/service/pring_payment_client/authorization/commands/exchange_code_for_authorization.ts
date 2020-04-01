import { PringPaymentClientContext } from "../../context";
import { Authorization } from "../../__common__/models/response/authorization";
import { ServerResponseParseError } from "../../__common__/models/response/server_response_parse_error";
import { UnexpectedErrorResponseError } from "../../__common__/models/response/unexpected_error_response_error";
import { ErrorSummary } from "../../__common__/models/utility/error_summary";
import { ApiResponse } from "../../__common__/models/utility/api_response";
import { InvalidCodeError } from "../models/response/invalid_code_error";
import { encryptString } from "../../__common__/functions/encrypt_string";

export async function exchangeCodeForAuthorization(
  context: PringPaymentClientContext,
  code: string
): Promise<
  | Authorization
  | InvalidCodeError
  | ServerResponseParseError
  | UnexpectedErrorResponseError
> {
  const { config, client } = context;
  const response = await client.request({
    method: "POST",
    path: "/auth/token/issue",
    body: {
      grant_type: "authorization_code",
      code: encryptString(config, code),
      client_id: config.attrs.clientId
    }
  });
  if (!(response instanceof ApiResponse)) {
    return interpretError(response);
  }
  return Authorization.fromApiResponse(response);
}

function interpretError(
  error: ServerResponseParseError | ErrorSummary
): InvalidCodeError | ServerResponseParseError | UnexpectedErrorResponseError {
  if (error instanceof ServerResponseParseError) {
    return error;
  }
  if (error.code === "NOT_EXIST_AUTHORIZATION_CODE_ERROR") {
    return new InvalidCodeError();
  }
  return new UnexpectedErrorResponseError(error);
}
