import React, {FunctionComponent} from 'react';
import {View, StyleSheet, Text, SafeAreaView} from 'react-native';
import {AppContext} from './app/app_context';
import {Card, Subheading, Paragraph} from 'react-native-paper';
import {PringHistoryItem} from '../effects/pring_history';
import {FlatList} from 'react-native-gesture-handler';

export const Timeline: FunctionComponent<{}> = () => {
  const {history} = React.useContext(AppContext);
  const reversedHistory = Array.from(history).reverse();
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={reversedHistory}
        renderItem={({item}) => HistoryItem(item)}
        keyExtractor={_createKey}
      />
    </SafeAreaView>
  );
};

interface CardSectionProps {
  value: string | null | undefined;
  label: string;
}

const CardSection: FunctionComponent<CardSectionProps> = ({value, label}) => {
  return (
    <View style={styles.section}>
      <Subheading>{label}</Subheading>
      <Text selectable={true}>{value ? value : 'なし'}</Text>
    </View>
  );
};

const HistoryItem: FunctionComponent<PringHistoryItem> = item => {
  switch (item.kind) {
    case 'tutorial': {
      return (
        <Card style={styles.card}>
          <Card.Title title="pringアプリ間連携決済デモ" />
          <Card.Content>
            <Paragraph>
              画面下部の＋ボタンをタップして、「認証」か「決済」を行えます
            </Paragraph>
          </Card.Content>
        </Card>
      );
    }
    case 'payment': {
      const {amount, orderNumber, paidAt, transactionId} = item;
      return (
        <Card style={styles.card}>
          <Card.Title title={`${amount}円のpring決済`} />
          <Card.Content>
            <CardSection
              label="注文番号"
              value={
                orderNumber.substring(0, 4) + '-' + orderNumber.substring(4)
              }
            />
            <CardSection label="client_transaction_id" value={transactionId} />
            <CardSection label="決済日時" value={paidAt} />
          </Card.Content>
        </Card>
      );
    }
    case 'redirect': {
      const {state, redirectedAt} = item;
      return (
        <Card style={styles.card}>
          <Card.Title title="pringアプリへのリダイレクト" />
          <Card.Content>
            <CardSection label="state" value={state} />
            <CardSection label="リダイレクト日時" value={redirectedAt} />
          </Card.Content>
        </Card>
      );
    }
    case 'callback': {
      const {state, code, calledBackAt} = item;
      return (
        <Card style={styles.card}>
          <Card.Title title="pringアプリからのコールバック" />
          <Card.Content>
            <CardSection label="state" value={state} />
            <CardSection label="認可コード" value={code} />
            <CardSection label="コールバック日時" value={calledBackAt} />
          </Card.Content>
        </Card>
      );
    }
    case 'obtainTokens': {
      const {code, authorization, obtainedAt} = item;
      const {accessToken, refreshToken} = authorization.attrs;
      return (
        <Card style={styles.card}>
          <Card.Title title="認可コードでトークンを取得" />
          <Card.Content>
            <CardSection label="認可コード" value={code} />
            <CardSection
              label="リフレッシュトークン"
              value={refreshToken.string}
            />
            <CardSection label="アクセストークン" value={accessToken.string} />
            <CardSection label="取得日時" value={obtainedAt} />
          </Card.Content>
        </Card>
      );
    }
    case 'refreshTokens': {
      const {oldRefreshToken, authorization, refreshedAt} = item;
      const {accessToken, refreshToken} = authorization.attrs;
      return (
        <Card style={styles.card}>
          <Card.Title title="リフレッシュトークンでトークンを更新" />
          <Card.Content>
            <CardSection
              label="旧リフレッシュトークン"
              value={oldRefreshToken}
            />
            <CardSection
              label="新リフレッシュトークン"
              value={refreshToken.string}
            />
            <CardSection label="アクセストークン" value={accessToken.string} />
            <CardSection label="更新日時" value={refreshedAt} />
          </Card.Content>
        </Card>
      );
    }
  }
};

function _createKey(item: PringHistoryItem): string {
  switch (item.kind) {
    case 'tutorial':
      return 'tutorial';
    case 'payment':
      return `payment-${item.transactionId}`;
    case 'redirect':
      return `redirect-${item.redirectedAt}`;
    case 'callback':
      return `callback-${item.calledBackAt}`;
    case 'obtainTokens':
      return `obtainTokens-${item.obtainedAt}`;
    case 'refreshTokens':
      return `refreshTokens-${item.refreshedAt}`;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  card: {
    marginVertical: 4,
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 8,
  },
});
