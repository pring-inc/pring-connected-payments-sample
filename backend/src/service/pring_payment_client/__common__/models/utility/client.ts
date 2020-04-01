import axios, { Method, AxiosInstance } from "axios";
import { ApiResponse } from "./api_response";
import { ErrorSummary } from "./error_summary";
import { TjpParseError } from "../../../../../generic/tjp";
import { PringPaymentClientConfig } from "../../../config";
import { ServerResponseParseError } from "../response/server_response_parse_error";

const API_VERSION = "1.0.0";

export class PringPaymentClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(config: PringPaymentClientConfig) {
    const { baseUrl } = config.attrs;
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        "X-PRING-API-VERSION": API_VERSION
      },
      validateStatus: _status => true
    });
  }

  async request(params: {
    method: Method;
    path: string;
    body?: any;
    headers?: any;
  }): Promise<ApiResponse | ErrorSummary | ServerResponseParseError> {
    const axiosResponse = await this.axiosInstance.request({
      method: params.method,
      url: "/external/client/connected" + params.path,
      data: params.body,
      headers: params.headers
    });
    const apiResponse = new ApiResponse({
      status: axiosResponse.status,
      body: axiosResponse.data
    });
    if (!apiResponse.isSuccessful()) {
      const error = ErrorSummary.fromApiResponse(apiResponse);
      if (error instanceof TjpParseError) {
        return new ServerResponseParseError({
          error,
          method: params.method,
          path: params.path,
          body: params.body,
          responseStatus: axiosResponse.status,
          responseBody: axiosResponse.data
        });
      }
      return error;
    }
    return apiResponse;
  }
}
