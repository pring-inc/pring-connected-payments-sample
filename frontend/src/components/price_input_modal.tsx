import React, {FunctionComponent} from 'react';
import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {PringPaymentClientReactContext} from '../effects/pring_payment/context';
import {createPayment} from '../effects/pring_payment/create_payment';
import {AppContext} from './app/app_context';
import {PringPaymentClientContext} from 'pring-payment-demo-backend/dist/service/pring_payment_client/context';
import {Authorization} from 'pring-payment-demo-backend/dist/service/pring_payment_client/__common__/models/response/authorization';
import {AuthorizationExpiredError} from 'pring-payment-demo-backend/dist/service/pring_payment_client/__common__/models/response/authorization_expired_error';
import {authorizeWithPring} from '../effects/authorize_with_pring';
import {PringHistoryItem} from '../effects/pring_history';
import {DateTime} from 'luxon';

export const PriceInputModal: FunctionComponent<{}> = () => {
  const [price, setPrice] = React.useState('');
  const navigation = useNavigation();
  const onCancel = React.useCallback(() => _onCancel(navigation), [navigation]);
  const context = React.useContext(PringPaymentClientReactContext);
  const {authorization, setAuthorization, appendHistory} = React.useContext(
    AppContext,
  );
  const onSubmit = React.useCallback(
    () =>
      _onSubmit(
        navigation,
        context,
        authorization,
        setAuthorization!,
        appendHistory!,
        Number.parseInt(price),
      ),
    [navigation, context, authorization, price],
  );
  return (
    <View style={styles.container}>
      <Text style={styles.text}>決済金額を入力してください</Text>
      <TextInput
        autoFocus={true}
        keyboardType="numeric"
        value={price}
        onChangeText={_sanitizePrice.bind(undefined, setPrice)}
        style={styles.priceInput}
      />
      <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>決済する</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>キャンセル</Text>
      </TouchableOpacity>
    </View>
  );
};

function _sanitizePrice(
  setPrice: (newPrice: string) => void,
  price: string,
): void {
  const priceAsNumber = Number.parseInt(price);
  const isEmpty = price.length === 0;
  const isNumber = priceAsNumber.toString() === price;
  const isPositive = priceAsNumber > 0;
  if (isEmpty || (isNumber && isPositive)) {
    setPrice(price);
  }
}

async function _onSubmit(
  navigation: ReturnType<typeof useNavigation>,
  context: PringPaymentClientContext,
  authorization: Authorization | null,
  setAuthorization: (newAuthorization: Authorization) => Promise<null>,
  appendHistory: (newHistory: PringHistoryItem) => Promise<null>,
  price: number,
): Promise<void> {
  if (Number.isNaN(price) || price <= 0) {
    Alert.alert('決済金額が未入力です');
    return;
  }
  if (authorization === null) {
    return authorizeWithPring(appendHistory);
  }
  try {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
    navigation.navigate('履歴');
    const [payment, newAuthorization] = await createPayment(
      context,
      authorization,
      price,
    );
    await setAuthorization(newAuthorization);
    if (
      authorization.attrs.accessToken.expiresAt !==
      newAuthorization.attrs.accessToken.expiresAt
    ) {
      await appendHistory({
        kind: 'refreshTokens',
        oldRefreshToken: authorization.attrs.refreshToken.string,
        authorization: newAuthorization,
        refreshedAt: DateTime.local().toISO(),
      });
    }
    const {amount, orderNumber, paidAt, transactionId} = payment.attrs;
    await appendHistory({
      kind: 'payment',
      amount,
      orderNumber,
      paidAt,
      transactionId,
    });
  } catch (error) {
    if (error instanceof AuthorizationExpiredError) {
      return authorizeWithPring(appendHistory);
    } else {
      throw error;
    }
  }
}

function _onCancel(navigation: ReturnType<typeof useNavigation>): void {
  if (navigation.canGoBack()) {
    navigation.goBack();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  priceInput: {
    marginVertical: 24,
    width: '80%',
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#999',
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 160,
    marginBottom: 16,
    backgroundColor: '#9c4',
    borderRadius: 8,
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 160,
    marginBottom: 16,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  priceErrorText: {
    marginBottom: 16,
  },
});
