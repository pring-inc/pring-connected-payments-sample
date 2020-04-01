import { ApiResponse } from "./api_response";
import { tjp, TjpParseError } from "../../../../../generic/tjp";

/**
 * APIからのエラーレスポンスを元に、
 * エラーの区別に必要な情報だけを取り出したオブジェクト。
 */
export class ErrorSummary {
  /** エラーレスポンスのHTTPステータスコード */
  readonly status: number;

  /**
   * エラーコード。
   *
   * レスポンスの$.errors[0].codeを取り出してこの値とする。
   */
  readonly code: string;

  static fromApiResponse(
    apiResponse: ApiResponse
  ): ErrorSummary | TjpParseError {
    try {
      return new ErrorSummary(apiResponse.attrs);
    } catch (error) {
      if (error instanceof TjpParseError) {
        return error;
      }
      throw error;
    }
  }

  private constructor(params: { status: number; body: unknown }) {
    this.status = params.status;
    this.code = tjp(params.body).object($ => {
      return $.get("errors").array($ => {
        return $.get(0).object($ => {
          return $.get("code").string;
        });
      });
    });
  }
}
