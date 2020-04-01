import { Authorization } from "../../../__common__/models/response/authorization";

export class CreatePayment {
  constructor(
    public readonly params: {
      readonly authorization: Authorization;
      readonly amount: number;
      readonly transactionId: string;
    }
  ) {}
}
