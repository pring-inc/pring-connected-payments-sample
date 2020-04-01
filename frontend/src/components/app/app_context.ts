import React from 'react';
import {Authorization} from 'pring-payment-demo-backend/dist/service/pring_payment_client/__common__/models/response/authorization';
import {PringHistoryItem} from '../../effects/pring_history';

export const AppContext = React.createContext<{
  code: string | null;
  authorization: Authorization | null;
  setAuthorization: ((newAuthorization: Authorization) => Promise<null>) | null;
  history: readonly PringHistoryItem[];
  appendHistory: ((newHistory: PringHistoryItem) => Promise<null>) | null;
}>({
  code: null,
  authorization: null,
  setAuthorization: null,
  history: [],
  appendHistory: null,
});
