import { PringPaymentClientContext } from "../../context";
import { Authorization } from "../../__common__/models/response/authorization";
import { ServerResponseParseError } from "../../__common__/models/response/server_response_parse_error";
import { UnexpectedErrorResponseError } from "../../__common__/models/response/unexpected_error_response_error";
import { ErrorSummary } from "../../__common__/models/utility/error_summary";
import { ApiResponse } from "../../__common__/models/utility/api_response";
import { encryptString } from "../../__common__/functions/encrypt_string";
import { AuthorizationExpiredError } from "../../__common__/models/response/authorization_expired_error";

export async function refreshAuthorization(
  context: PringPaymentClientContext,
  authorization: Authorization
): Promise<
  | Authorization
  | AuthorizationExpiredError
  | ServerResponseParseError
  | UnexpectedErrorResponseError
> {
  const { config, client } = context;
  const response = await client.request({
    method: "POST",
    path: "/auth/token/issue",
    body: {
      grant_type: "refresh_token",
      refresh_token: encryptString(
        config,
        authorization.attrs.refreshToken.string
      ),
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
