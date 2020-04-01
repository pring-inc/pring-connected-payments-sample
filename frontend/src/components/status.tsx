import React, {FunctionComponent} from 'react';
import {View, StyleSheet, Text, SafeAreaView} from 'react-native';
import {Card, Subheading} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AppContext} from './app/app_context';

export const Status: FunctionComponent<{}> = () => {
  const {code, authorization} = React.useContext(AppContext);

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="認証"
          left={({size}) => <Icon name="lock" size={size} />}
        />
        <Card.Content>
          <CardSection label="認可コード" value={code} />
          <CardSection
            label="リフレッシュトークン"
            value={authorization?.attrs.refreshToken.string}
          />
          <CardSection
            label="アクセストークン"
            value={authorization?.attrs.accessToken.string}
          />
        </Card.Content>
      </Card>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  card: {
    marginTop: 8,
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 12,
  },
});
