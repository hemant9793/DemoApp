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
import ExpenseScreen from './src/screens/homescreen';
import {ToastProvider} from './src/common/components/toast/ToastContext';

const App = () => {
  return (
    <ToastProvider>
      <ExpenseScreen />
    </ToastProvider>
  );
};

export default App;
