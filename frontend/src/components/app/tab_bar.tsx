import React, {FunctionComponent} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RouteDefinition} from './route_definition';

export interface TabBarProps {
  routeDefinitions: ReadonlyArray<RouteDefinition>;
  showActionSheet: () => void;
}

export const TabBar: (
  props: TabBarProps,
) => FunctionComponent<BottomTabBarProps> = boundProps => {
  return props => <_TabBar {...props} {...boundProps} />;
};

export const _TabBar: FunctionComponent<BottomTabBarProps &
  TabBarProps> = props => {
  const {routes} = props.state;
  const buttons = routes.map((route, index) =>
    TabItem({
      ...props,
      route,
      routeDefinition: props.routeDefinitions[index],
      index,
    }),
  );
  buttons.splice(
    routes.length / 2,
    0,
    <View key="Action" style={styles.actionButtonContainer}>
      <TouchableWithoutFeedback onPress={props.showActionSheet}>
        <View style={styles.actionButton}>
          <Icon name="add" size={44} color="#fff" />
        </View>
      </TouchableWithoutFeedback>
    </View>,
  );

  return <SafeAreaView style={styles.container}>{buttons}</SafeAreaView>;
};

interface TabItemProps extends BottomTabBarProps {
  route: BottomTabBarProps['state']['routes'][0];
  routeDefinition: RouteDefinition;
  index: number;
}

const TabItem: FunctionComponent<TabItemProps> = ({
  state,
  navigation,
  route,
  routeDefinition,
  index,
}) => {
  const isFocused = state.index === index;
  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };
  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };
  const color = isFocused ? '#333' : '#aaa';
  return (
    <TouchableWithoutFeedback
      key={route.name}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View style={styles.tabButton}>
        <Icon name={routeDefinition.icon} size={28} color={color} />
        <Text style={{color}}>{route.name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const ACTION_BUTTON_RADIUS = 40;
const ACTION_BUTTON_MARGIN = 8;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  actionButtonContainer: {
    width: 2 * ACTION_BUTTON_RADIUS,
    borderRadius: ACTION_BUTTON_RADIUS,
  },
  actionButton: {
    position: 'absolute',
    bottom: ACTION_BUTTON_MARGIN,
    width: 2 * ACTION_BUTTON_RADIUS,
    height: 2 * ACTION_BUTTON_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9c4',
    borderRadius: ACTION_BUTTON_RADIUS,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});
