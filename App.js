import React from 'react';
import AppNavigation from './src/navigations';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Store from './src/redux/Store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={Store}>
        <GestureHandlerRootView >
          <AppNavigation />
        </GestureHandlerRootView>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
