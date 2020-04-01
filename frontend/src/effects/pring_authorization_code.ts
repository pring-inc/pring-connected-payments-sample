import React from 'react';
import SInfo from 'react-native-sensitive-info';

const CODE_STORAGE_KEY = 'pringPaymentAuthorizationCode';

export function usePringAuthorizationCode(): [
  string | null,
  (newCode: string) => Promise<null>,
] {
  const [codeState, setCodeState] = React.useState<string | null>(null);
  React.useEffect(() => {
    SInfo.getItem(CODE_STORAGE_KEY, {}).then(storedCode => {
      if (storedCode) {
        setCodeState(storedCode);
      }
    });
  }, []);
  return [
    codeState,
    (newCode: string) => {
      setCodeState(newCode);
      return SInfo.setItem(CODE_STORAGE_KEY, newCode, {});
    },
  ];
}
