import React from 'react';
import SInfo from 'react-native-sensitive-info';
import {Authorization} from 'pring-payment-demo-backend/dist/service/pring_payment_client/__common__/models/response/authorization';

const TOKENS_STORAGE_KEY = 'pringPaymentTokens';

export function usePringAuthorization(): [
  Authorization | null,
  (newAuthorization: Authorization) => Promise<null>,
] {
  const [
    authorizationState,
    setAuthorizationState,
  ] = React.useState<Authorization | null>(null);
  React.useEffect(() => {
    SInfo.getItem(TOKENS_STORAGE_KEY, {}).then(encoded => {
      if (encoded) {
        const parsed = JSON.parse(encoded);
        setAuthorizationState(parsed);
      }
    });
  }, []);
  return [
    authorizationState,
    (newAuthorization: Authorization) => {
      setAuthorizationState(newAuthorization);
      const encoded = JSON.stringify(newAuthorization);
      return SInfo.setItem(TOKENS_STORAGE_KEY, encoded, {});
    },
  ];
}
