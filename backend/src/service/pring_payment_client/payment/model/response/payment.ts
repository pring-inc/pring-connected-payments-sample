import { ApiResponse } from "../../../__common__/models/utility/api_response";
import { tjp } from "../../../../../generic/tjp";

export class Payment {
  static fromApiResponse(apiResponse: ApiResponse): Payment {
    return new Payment(
      tjp(apiResponse.attrs.body).object($ => ({
        amount: $.get("amount").number,
        transactionId: $.get("client_transaction_id").string,
        paidAt: $.get("paid_at").string,
        orderNumber: $.get("order_number").string
      }))
    );
  }

  constructor(
    public readonly attrs: {
      readonly amount: number;
      readonly transactionId: string;
      readonly paidAt: string;
      readonly orderNumber: string;
    }
  ) {}
}
