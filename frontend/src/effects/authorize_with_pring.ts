import {Linking, Alert} from 'react-native';
import Config from 'react-native-config';
import {storePringAuthorizationState} from './pring_authorization_state';
import {PringHistoryItem} from './pring_history';
import {DateTime} from 'luxon';

const AUTHORIZATION_DEEP_LINK_URL =
  Config.PRING_APP_CUSTOM_SCHEME + '://pring.app/auth/authorize';

export async function authorizeWithPring(
  appendHistory: (newHistory: PringHistoryItem) => Promise<null>,
): Promise<void> {
  Alert.alert(
    '確認',
    'pringアプリに移動します\n移動先の画面で認証を許可してください',
    [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: '移動',
        onPress: async () => {
          const succeeded = await openDeepLinkUrl(appendHistory);
          if (!succeeded) {
            Alert.alert(
              'pringアプリが開けませんでした',
              'pringアプリがインストールされていることをお確かめの上、もう一度お試しください',
            );
          }
        },
      },
    ],
  );
}

async function openDeepLinkUrl(
  appendHistory: (newHistory: PringHistoryItem) => Promise<null>,
): Promise<boolean> {
  const state = await storePringAuthorizationState();
  const deepLinkUrl = _createDeepLinkUrl(Config.PRING_PAYMENT_CLIENT_ID, state);
  try {
    const supported = await Linking.canOpenURL(deepLinkUrl);
    if (!supported) {
      return false;
    }
    await appendHistory({
      kind: 'redirect',
      state,
      redirectedAt: DateTime.local().toISO(),
    });
    await Linking.openURL(deepLinkUrl);
    return true;
  } catch (error) {
    return false;
  }
}

function _createDeepLinkUrl(clientId: string, state: string): string {
  return (
    AUTHORIZATION_DEEP_LINK_URL +
    '?client_id=' +
    clientId +
    '&state=' +
    state +
    '&scope=connected_payments+connected_continuations'
  );
}
