interface Environment {
  [key: string]: string;
}

export class PringPaymentClientConfig {
  static fromEnvironment(env: Environment): PringPaymentClientConfig {
    return new PringPaymentClientConfig({
      baseUrl: env.PRING_PAYMENT_BASE_URL,
      clientId: env.PRING_PAYMENT_CLIENT_ID,
      clientSecret: env.PRING_PAYMENT_CLIENT_SECRET
    });
  }

  constructor(
    public readonly attrs: {
      readonly baseUrl: string;
      readonly clientId: string;
      readonly clientSecret: string;
    }
  ) {}
}
