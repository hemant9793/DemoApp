import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons from react-native-vector-icons
import HomeScreen from '../screens/homescreen'; //  Make sure these exist and are TS
import {YearlyCalendar} from '../screens/yearCalendar'; //  Make sure these exist and are TS

// Define the type for the route parameters, if any.  Use undefined if no params.
type RootTabParamList = {
  ExpensScreen: undefined;
  YearlyCalendar: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          if (route.name === 'ExpensScreen') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'YearlyCalendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#f0f0f0',
          borderTopWidth: 1,
          borderTopColor: '#ccc',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}>
      <Tab.Screen
        name="ExpensScreen"
        component={HomeScreen}
        options={{title: 'Finance'}}
      />
      <Tab.Screen
        name="YearlyCalendar"
        component={YearlyCalendar}
        options={{title: 'Year'}}
      />
    </Tab.Navigator>
  );
}
