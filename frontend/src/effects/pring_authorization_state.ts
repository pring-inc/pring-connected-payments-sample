import forge from 'node-forge';
import SInfo from 'react-native-sensitive-info';

const STATE_STORAGE_KEY = 'pringPaymentState';

export async function storePringAuthorizationState(): Promise<string> {
  const state = _createState();
  await SInfo.setItem(STATE_STORAGE_KEY, state, {});
  return state;
}

export async function verifyPringAuthorizationState(
  received: string,
): Promise<boolean> {
  const stored = await SInfo.getItem(STATE_STORAGE_KEY, {});
  const isValid = stored === received;
  return isValid;
}

function _createState(): string {
  const randomBytes = forge.random.getBytesSync(16);
  const state = forge.util.bytesToHex(randomBytes);
  return state;
}
