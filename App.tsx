import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { PokedexScreen } from './screens/PokedexScreen';
import { PokemonDetailScreen } from './screens/PokemonDetailScreen';
import { RootStackParamList } from './types/Pokemon';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={PokedexScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Details"
            component={PokemonDetailScreen}
            options={({ route }) => ({
              title: route.params.pokemon.name.toUpperCase(),
              headerStyle: { backgroundColor: '#e3350d' },
              headerTintColor: '#fff',
              headerBackTitle: 'Voltar'
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}