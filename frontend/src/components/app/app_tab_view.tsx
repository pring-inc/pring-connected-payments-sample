import React, {FunctionComponent} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Status} from '../status';
import {Timeline} from '../timeline';
import {RouteDefinition} from './route_definition';
import {TabBar} from './tab_bar';
import {createAppActionSheetRef, AppActionSheet} from './app_action_sheet';

const Tab = createBottomTabNavigator();

const routeDefinitions: ReadonlyArray<RouteDefinition> = [
  {
    name: '履歴',
    component: Timeline,
    icon: 'history',
  },
  {
    name: 'ステータス',
    component: Status,
    icon: 'info',
  },
];

export const AppTabView: FunctionComponent<{}> = () => {
  const actionSheetRef = createAppActionSheetRef();
  const showActionSheet = React.useCallback(() => {
    actionSheetRef.current?.show();
  }, [actionSheetRef]);

  return (
    <>
      <Tab.Navigator tabBar={TabBar({routeDefinitions, showActionSheet})}>
        {routeDefinitions.map(route => (
          <Tab.Screen
            key={route.name}
            name={route.name}
            component={route.component}
          />
        ))}
      </Tab.Navigator>
      <AppActionSheet ref={actionSheetRef} />
    </>
  );
};
