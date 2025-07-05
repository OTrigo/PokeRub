
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PokemonListScreen from '../../src/screens/PokemonListScreen';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../src/AppNavigator';

// Mock the API call
jest.mock('../../src/services/api', () => ({
  getPokemonList: jest.fn(() =>
    Promise.resolve([
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    ])
  ),
}));

// Mock fetch for detailed pokemon data
global.fetch = jest.fn((url) => {
  if (url.includes('pokemon/1')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        id: 1, name: 'bulbasaur', height: 7, weight: 69, sprites: { front_default: '' }, types: [{ type: { name: 'grass' } }], abilities: [], species: { name: '', url: '' }
      }),
    });
  } else if (url.includes('pokemon/4')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        id: 4, name: 'charmander', height: 6, weight: 85, sprites: { front_default: '' }, types: [{ type: { name: 'fire' } }], abilities: [], species: { name: '', url: '', }
      }),
    });
  }
  return Promise.reject(new Error('not found'));
});

const mockNavigation: StackNavigationProp<RootStackParamList, 'PokemonList'> = {
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

describe('PokemonListScreen', () => {
  it('renders the pokemon list and filters', async () => {
    const { findByText, queryByText, getByPlaceholderText } = render(
      <PokemonListScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(findByText('bulbasaur')).toBeTruthy();
      expect(findByText('charmander')).toBeTruthy();
    }, { timeout: 10000 });

    const searchInput = getByPlaceholderText('Search Pokémon by name');
    fireEvent.changeText(searchInput, 'bulb');

    expect(findByText('bulbasaur')).toBeTruthy();
    expect(queryByText('charmander')).toBeNull();
  });

  it('navigates to detail screen on pokemon press', async () => {
    const { findByText } = render(
      <PokemonListScreen navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(findByText('bulbasaur')).toBeTruthy();
    }, { timeout: 10000 });

    fireEvent.press(await findByText('bulbasaur'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      'PokemonDetail',
      expect.objectContaining({ pokemon: expect.any(Object) })
    );
  });
});
