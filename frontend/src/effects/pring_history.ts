import React from 'react';
import SInfo from 'react-native-sensitive-info';
import {Authorization} from 'pring-payment-demo-backend/dist/service/pring_payment_client/__common__/models/response/authorization';
import {Alert} from 'react-native';

const HISTORY_STORAGE_KEY = 'pringHistory';

export type PringHistoryItem =
  | PringHistoryTutorialItem
  | PringHistoryPaymentItem
  | PringHistoryRedirectItem
  | PringHistoryCallbackItem
  | PringHistoryObtainTokensItem
  | PringHistoryRefreshTokensItem;

export interface PringHistoryTutorialItem {
  kind: 'tutorial';
}

export interface PringHistoryPaymentItem {
  kind: 'payment';
  amount: number;
  orderNumber: string;
  paidAt: string;
  transactionId: string;
}

export interface PringHistoryRedirectItem {
  kind: 'redirect';
  state: string;
  redirectedAt: string;
}

export interface PringHistoryCallbackItem {
  kind: 'callback';
  state: string;
  code: string;
  calledBackAt: string;
}

export interface PringHistoryObtainTokensItem {
  kind: 'obtainTokens';
  code: string;
  authorization: Authorization;
  obtainedAt: string;
}

export interface PringHistoryRefreshTokensItem {
  kind: 'refreshTokens';
  oldRefreshToken: string;
  authorization: Authorization;
  refreshedAt: string;
}

export function usePringHistory(): [
  readonly PringHistoryItem[],
  (item: PringHistoryItem) => Promise<null>,
] {
  const [historyState, setHistoryState] = React.useState<
    readonly PringHistoryItem[]
  >([]);
  const appendPringHistory = _appendPringHistory.bind(
    undefined,
    setHistoryState,
  );
  React.useEffect(() => {
    SInfo.getItem(HISTORY_STORAGE_KEY, {}).then(storedHistory => {
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        if (parsed) {
          setHistoryState(parsed);
        }
      } else {
        appendPringHistory({kind: 'tutorial'});
      }
    });
  }, []);
  return [historyState, appendPringHistory];
}

async function _appendPringHistory(
  setHistory: (newHistory: readonly PringHistoryItem[]) => void,
  item: PringHistoryItem,
): Promise<null> {
  const stored = await SInfo.getItem(HISTORY_STORAGE_KEY, {});
  const parsed = stored ? JSON.parse(stored) : [];
  const history = Array.isArray(parsed) ? parsed : [];
  const newHistory = [...history, item];
  setHistory(newHistory);
  const encoded = JSON.stringify(newHistory);
  return SInfo.setItem(HISTORY_STORAGE_KEY, encoded, {});
}
