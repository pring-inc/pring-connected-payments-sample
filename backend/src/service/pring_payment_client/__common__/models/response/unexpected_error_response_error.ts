import { ErrorSummary } from "../utility/error_summary";

export class UnexpectedErrorResponseError {
  public readonly message: string;

  constructor(error: ErrorSummary) {
    this.message = `\
pringアプリ間連携決済APIから想定外のエラーレスポンスを受け取りました

レスポンスステータス:
${error.status}

エラーコード:
${error.code}`;
  }
}
