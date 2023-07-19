import React from 'react';
import {SafeAreaView, StatusBar, View, useColorScheme} from 'react-native';
import TodosScreen from './screens/TodosScreen';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UpdateTodoScreen from './screens/UpdateTodoScreen';
import {QueryClient, QueryClientProvider} from 'react-query';
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export type RootStackParamList = {
  Todos: undefined;
  update: {
    id: number;
    title: string;
    done: boolean;
    desc: string;
  };
};

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
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Todos" component={TodosScreen} />
              <Stack.Screen name="update" component={UpdateTodoScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </QueryClientProvider>
      </View>
    </SafeAreaView>
  );
}

export default App;
