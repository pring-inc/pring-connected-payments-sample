import { Method } from "axios";
import { ApiResponse } from "../models/utility/api_response";
import { ErrorSummary } from "../models/utility/error_summary";
import { ServerResponseParseError } from "../models/response/server_response_parse_error";
import { Authorization } from "../models/response/authorization";
import { DateTime } from "luxon";
import { PringPaymentClientContext } from "../../context";
import { refreshAuthorization } from "../../authorization/commands/refresh_authorization";
import { AuthorizationExpiredError } from "../models/response/authorization_expired_error";
import { UnexpectedErrorResponseError } from "../models/response/unexpected_error_response_error";

export async function requestWithAuthorization(
  context: PringPaymentClientContext,
  params: {
    authorization: Authorization;
    method: Method;
    path: string;
    body?: any;
    headers?: any;
  }
): Promise<
  [
    (
      | ApiResponse
      | ErrorSummary
      | ServerResponseParseError
      | AuthorizationExpiredError
      | UnexpectedErrorResponseError
    ),
    Authorization
  ]
> {
  const { client } = context;
  const { accessToken } = params.authorization.attrs;
  const request = {
    method: params.method,
    path: params.path,
    body: params.body,
    headers: Object.assign({}, params.headers, {
      Authorization: "Bearer " + accessToken.string
    })
  };
  if (accessToken.expiresAt > DateTime.local()) {
    const response = await client.request(request);
    if (!_isAccessTokenExpiredError(response)) {
      return [response, params.authorization];
    }
  }
  const refreshResponse = await refreshAuthorization(
    context,
    params.authorization
  );
  if (!(refreshResponse instanceof Authorization)) {
    return [refreshResponse, params.authorization];
  }
  request.headers["Authorization"] =
    "Bearer " + refreshResponse.attrs.accessToken.string;
  const retryResponse = await client.request(request);
  return [retryResponse, refreshResponse];
}

function _isAccessTokenExpiredError(response: any): boolean {
  return (
    response instanceof ErrorSummary && response.code === "INVALID_ACCESS_TOKEN"
  );
}
