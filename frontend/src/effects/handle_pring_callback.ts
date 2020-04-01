import {Linking, Alert} from 'react-native';
import Url from 'url-parse';
import {verifyPringAuthorizationState} from './pring_authorization_state';
import {PringPaymentClientContext} from 'pring-payment-demo-backend/dist/service/pring_payment_client/context';
import {exchangeCodeForTokens} from './pring_payment/exchange_code_for_tokens';
import {Authorization} from 'pring-payment-demo-backend/dist/service/pring_payment_client/__common__/models/response/authorization';
import {PringHistoryItem} from './pring_history';
import {DateTime} from 'luxon';

export function handlePringCallback(
  context: PringPaymentClientContext,
  setCode: (newCode: string) => Promise<null>,
  setAuthorization: (newAuthorization: Authorization) => Promise<null>,
  appendHistory: (newHistory: PringHistoryItem) => Promise<null>,
): () => void {
  const handleUrl = _handleUrl.bind(
    undefined,
    context,
    setCode,
    setAuthorization,
    appendHistory,
  );
  Linking.getInitialURL().then(url => {
    if (url !== null) {
      handleUrl({url});
    }
  });
  Linking.addEventListener('url', handleUrl);
  return () => {
    Linking.removeEventListener('url', handleUrl);
  };
}

async function _handleUrl(
  context: PringPaymentClientContext,
  setCode: (newCode: string) => Promise<null>,
  setAuthorization: (newAuthorization: Authorization) => Promise<null>,
  appendHistory: (newHistory: PringHistoryItem) => Promise<null>,
  event: {url: string},
): Promise<void> {
  const parsedUrl = new Url(event.url, true);
  if (parsedUrl.pathname !== '/pring_payment/callback') {
    return;
  }
  const isValidUrl = await _verifyUrl(parsedUrl);
  if (!isValidUrl) {
    Alert.alert('pringアプリの認証に失敗しました');
    return;
  }
  const code = parsedUrl.query.code!;
  await setCode(code);
  appendHistory({
    kind: 'callback',
    state: parsedUrl.query.state!,
    code,
    calledBackAt: DateTime.local().toISO(),
  });
  try {
    const authorization = await exchangeCodeForTokens(context, code);
    await setAuthorization(authorization);
    await appendHistory({
      kind: 'obtainTokens',
      code,
      authorization,
      obtainedAt: DateTime.local().toISO(),
    });
  } catch (error) {
    console.error(error.constructor.name);
    Alert.alert('pringアプリの認証に失敗しました');
    return;
  }
}

async function _verifyUrl(parsedUrl: Url): Promise<boolean> {
  const state = parsedUrl.query.state;
  if (state === undefined) {
    return false;
  }
  const validState = await verifyPringAuthorizationState(state);
  if (!validState) {
    return false;
  }
  const code = parsedUrl.query.code;
  if (code === undefined) {
    return false;
  }
  return true;
}
