import { DateTime } from "luxon";
import { ApiResponse } from "../utility/api_response";
import { tjp } from "../../../../../generic/tjp";

export class Authorization {
  static fromApiResponse(apiResponse: ApiResponse): Authorization {
    const now = DateTime.local();
    return new Authorization(
      tjp(apiResponse.attrs.body).object($ => {
        return {
          accessToken: {
            string: $.get("access_token").string,
            expiresAt: now.plus({
              seconds: $.get("access_token_expires_in").number
            })
          },
          refreshToken: {
            string: $.get("refresh_token").string,
            expiresAt: now.plus({
              seconds: $.get("refresh_token_expires_in").number
            })
          }
        };
      })
    );
  }

  constructor(
    public readonly attrs: {
      readonly accessToken: {
        readonly string: string;
        readonly expiresAt: DateTime;
      };
      readonly refreshToken: Authorization["attrs"]["accessToken"];
    }
  ) {}
}
