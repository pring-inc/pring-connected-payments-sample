/**
 * APIサーバからのレスポンスを表すオブジェクト。
 */
export class ApiResponse {
  constructor(
    public readonly attrs: {
      readonly status: number;
      readonly body: unknown;
    }
  ) {}

  /**
   * HTTPステータスが2xxであればtrue、さもなくばfalseを返す。
   */
  isSuccessful(): boolean {
    return this.attrs.status >= 200 && this.attrs.status < 300;
  }
}
