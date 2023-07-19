import React from 'react';
import {SafeAreaView, StatusBar, View, useColorScheme} from 'react-native';
import TodosScreen from './styles/screens/TodosScreen';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{height: '100%'}}>
        <TodosScreen />
      </View>
    </SafeAreaView>
  );
}

export default App;
