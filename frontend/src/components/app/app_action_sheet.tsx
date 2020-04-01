import React, {FunctionComponent} from 'react';
import ActionSheet from 'react-native-actionsheet';
import {useNavigation} from '@react-navigation/native';
import {authorizeWithPring} from '../../effects/authorize_with_pring';
import {AppContext} from './app_context';
import {PringHistoryItem} from '../../effects/pring_history';

interface AppActionSheetProps {
  forwardedRef?: React.Ref<ActionSheet>;
}

export const AppActionSheet = React.forwardRef<ActionSheet>((props, ref) => (
  <_AppActionSheet {...props} forwardedRef={ref} />
));

const _AppActionSheet: FunctionComponent<AppActionSheetProps> = ({
  forwardedRef,
}) => {
  const navigation = useNavigation();
  const {appendHistory} = React.useContext(AppContext);
  const onPress = React.useCallback(
    (index: number) => {
      _onPress(navigation, appendHistory!, index);
    },
    [navigation, appendHistory],
  );

  return (
    <ActionSheet
      ref={forwardedRef}
      options={['認証する', '決済する', 'キャンセル']}
      cancelButtonIndex={2}
      onPress={onPress}
    />
  );
};

export function createAppActionSheetRef(): React.RefObject<ActionSheet> {
  return React.createRef();
}

function _onPress(
  navigation: ReturnType<typeof useNavigation>,
  appendHistory: (newHistory: PringHistoryItem) => Promise<null>,
  index: number,
): void {
  switch (index) {
    case 0:
      authorizeWithPring(appendHistory);
      break;
    case 1:
      navigation.navigate('PriceInput');
      break;
    default:
      break;
  }
}
