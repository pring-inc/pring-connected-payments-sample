import { TjpParseError } from "../../../../../generic/tjp";
import { tjpErrorMessage } from "../../../../../generic/tjp_error_message";
import { Method } from "axios";

export class ServerResponseParseError {
  public readonly message: string;

  constructor(params: {
    error: TjpParseError;
    method: Method;
    path: string;
    body?: any;
    responseStatus: number;
    responseBody: any;
  }) {
    this.message = `\
pringアプリ間連携決済APIからのレスポンスのパースに失敗しました

エンドポイント:
${params.method} ${params.path}

リクエストボディ:
${JSON.stringify(params.body, null, 2)}

レスポンスステータス: 
${params.responseStatus}

レスポンスボディ:
${JSON.stringify(params.responseBody, null, 2)}

パースエラー:
${tjpErrorMessage(params.error)}`;
  }
}
