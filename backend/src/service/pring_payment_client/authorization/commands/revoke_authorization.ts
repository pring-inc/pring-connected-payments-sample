import { PringPaymentClientContext } from "../../context";
import { Authorization } from "../../__common__/models/response/authorization";
import { ServerResponseParseError } from "../../__common__/models/response/server_response_parse_error";
import { UnexpectedErrorResponseError } from "../../__common__/models/response/unexpected_error_response_error";
import { ErrorSummary } from "../../__common__/models/utility/error_summary";
import { ApiResponse } from "../../__common__/models/utility/api_response";
import { encryptString } from "../../__common__/functions/encrypt_string";
import { AuthorizationExpiredError } from "../../__common__/models/response/authorization_expired_error";

export async function revokeAuthorization(
  context: PringPaymentClientContext,
  authorization: Authorization
): Promise<
  | void
  | AuthorizationExpiredError
  | ServerResponseParseError
  | UnexpectedErrorResponseError
> {
  const { config, client } = context;
  const response = await client.request({
    method: "POST",
    path: "/auth/token/revoke",
    body: {
      client_id: config.attrs.clientId,
      refresh_token: encryptString(
        config,
        authorization.attrs.refreshToken.string
      )
    }
  });
  if (!(response instanceof ApiResponse)) {
    return interpretError(response);
  }
}

function interpretError(
  error: ServerResponseParseError | ErrorSummary
):
  | AuthorizationExpiredError
  | ServerResponseParseError
  | UnexpectedErrorResponseError {
  if (error instanceof ServerResponseParseError) {
    return error;
  }
  if (error.code === "INVALID_REFRESH_TOKEN") {
    return new AuthorizationExpiredError();
  }
  return new UnexpectedErrorResponseError(error);
}
