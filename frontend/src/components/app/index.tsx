import React, {FunctionComponent} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppTabView} from './app_tab_view';
import {handlePringCallback} from '../../effects/handle_pring_callback';
import {PriceInputModal} from '../price_input_modal';
import {PringPaymentClientReactContext} from '../../effects/pring_payment/context';
import {usePringAuthorizationCode} from '../../effects/pring_authorization_code';
import {usePringAuthorization} from '../../effects/pring_authorization';
import {AppContext} from './app_context';
import {usePringHistory} from '../../effects/pring_history';

const RootStack = createStackNavigator();

export const App: FunctionComponent<{}> = () => {
  const pringPaymentClientContext = React.useContext(
    PringPaymentClientReactContext,
  );
  const [code, setCode] = usePringAuthorizationCode();
  const [authorization, setAuthorization] = usePringAuthorization();
  const [history, appendHistory] = usePringHistory();
  React.useEffect(
    () =>
      handlePringCallback(
        pringPaymentClientContext,
        setCode,
        setAuthorization,
        appendHistory,
      ),
    [],
  );
  const appContext = {
    code,
    authorization,
    setAuthorization,
    history,
    appendHistory,
  };

  return (
    <AppContext.Provider value={appContext}>
      <NavigationContainer>
        <RootStack.Navigator mode="modal">
          <RootStack.Screen
            name="Main"
            component={AppTabView}
            options={{headerShown: false}}
          />
          <RootStack.Screen
            name="PriceInput"
            component={PriceInputModal}
            options={{headerShown: false}}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
};
