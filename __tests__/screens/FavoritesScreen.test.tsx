
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FavoritesScreen from '../../src/screens/FavoritesScreen';
import { FavoritesContext } from '../../src/contexts/FavoritesContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../src/AppNavigator';
import { Pokemon } from '../../src/types/pokemon';

const mockNavigation: StackNavigationProp<RootStackParamList, 'Favorites'> = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  reset: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
} as any;

describe('FavoritesScreen', () => {
  it('renders empty message when no favorites', () => {
    const { getByText } = render(
      <FavoritesContext.Provider value={{ favorites: [], addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn() }}>
        <FavoritesScreen navigation={mockNavigation} />
      </FavoritesContext.Provider>
    );
    expect(getByText('No favorite Pokémons yet.')).toBeTruthy();
  });

  it('renders favorite pokemons and allows removal', () => {
    const mockPokemon: Pokemon = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      sprites: { front_default: '' },
      types: [{ slot: 1, type: { name: 'grass', url: '' } }],
      abilities: [],
      species: { name: '', url: '' },
    };
    const removeFavorite = jest.fn();

    const { getByText } = render(
      <FavoritesContext.Provider value={{ favorites: [mockPokemon], addFavorite: jest.fn(), removeFavorite, isFavorite: jest.fn() }}>
        <FavoritesScreen navigation={mockNavigation} />
      </FavoritesContext.Provider>
    );

    expect(getByText('bulbasaur')).toBeTruthy();
    fireEvent.press(getByText('Remove'));
    expect(removeFavorite).toHaveBeenCalledWith(mockPokemon.id);
  });

  it('navigates to detail screen on pokemon press', () => {
    const mockPokemon: Pokemon = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      sprites: { front_default: '' },
      types: [{ slot: 1, type: { name: 'grass', url: '' } }],
      abilities: [],
      species: { name: '', url: '', },
    };

    const { getByText } = render(
      <FavoritesContext.Provider value={{ favorites: [mockPokemon], addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn() }}>
        <FavoritesScreen navigation={mockNavigation} />
      </FavoritesContext.Provider>
    );

    fireEvent.press(getByText('bulbasaur'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      'PokemonDetail',
      { pokemon: mockPokemon }
    );
  });
});
