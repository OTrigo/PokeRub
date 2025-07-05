
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PokemonListScreen from './screens/PokemonListScreen';
import PokemonDetailScreen from './screens/PokemonDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import { Pokemon } from './types/pokemon';

export type RootStackParamList = {
  PokemonList: undefined;
  PokemonDetail: { pokemon: Pokemon };
  Favorites: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PokemonList">
        <Stack.Screen name="PokemonList" component={PokemonListScreen} options={{ title: 'PokéRub' }} />
        <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen} options={{ title: 'Pokémon Details' }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorite Pokémons' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
