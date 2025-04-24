/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {ToastProvider} from './src/common/components/toast/ToastContext';
import {RootTabs} from './src/navigation/tabNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <ToastProvider>
        <RootTabs />
      </ToastProvider>
    </NavigationContainer>
  );
};

export default App;
