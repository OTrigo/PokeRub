import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import PokemonDetailScreen from '../../src/screens/PokemonDetailScreen';
import { FavoritesContext } from '../../src/contexts/FavoritesContext';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../src/AppNavigator';
import { Pokemon } from '../../src/types/pokemon';

// Mock API calls
jest.mock('../../src/services/api', () => ({
  getPokemonDetail: jest.fn(() =>
    Promise.resolve({
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      sprites: { front_default: 'test-image.png' },
      types: [{ slot: 1, type: { name: 'grass', url: 'some_url' } }],
      abilities: [{ ability: { name: 'overgrow', url: 'some_url' }, is_hidden: false, slot: 1 }],
      species: { name: 'bulbasaur', url: 'species-url' },
    })
  ),
  getPokemonSpecies: jest.fn(() =>
    Promise.resolve({
      evolution_chain: { url: 'evolution-chain-url' },
      flavor_text_entries: [{ flavor_text: 'A strange seed was planted.', language: { name: 'en' } }],
    })
  ),
  getEvolutionChain: jest.fn(() =>
    Promise.resolve({
      baby_trigger_item: null,
      chain: {
        evolution_details: [],
        evolves_to: [
          { species: { name: 'ivysaur', url: '' }, evolves_to: [], is_baby: false },
        ],
        is_baby: false,
        species: { name: 'bulbasaur', url: '' },
      },
      id: 1,
    })
  ),
}));

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: { front_default: 'test-image.png' },
  types: [{ slot: 1, type: { name: 'grass', url: 'some_url' } }],
  abilities: [{ ability: { name: 'overgrow', url: 'some_url' }, is_hidden: false, slot: 1 }],
  species: { name: 'bulbasaur', url: 'species-url' },
};

const mockRoute: RouteProp<RootStackParamList, 'PokemonDetail'> = {
  key: 'PokemonDetail-key',
  name: 'PokemonDetail',
  params: { pokemon: mockPokemon },
};

describe('PokemonDetailScreen', () => {
  it('renders pokemon details and handles favorites', async () => {
    const addFavorite = jest.fn();
    const removeFavorite = jest.fn();
    const isFavorite = jest.fn(() => false);

    const { findByText, getByText } = render(
      <FavoritesContext.Provider value={{ favorites: [], addFavorite, removeFavorite, isFavorite }}>
        <PokemonDetailScreen route={mockRoute} />
      </FavoritesContext.Provider>
    );

    await waitFor(() => {
      expect(findByText('Type: grass')).toBeTruthy();
      expect(findByText('Height: 0.7 m')).toBeTruthy();
      expect(findByText('Weight: 6.9 kg')).toBeTruthy();
      expect(findByText('Abilities:')).toBeTruthy();
      expect(findByText('- overgrow')).toBeTruthy();
      expect(findByText('Category:')).toBeTruthy();
      expect(findByText('A strange seed was planted.')).toBeTruthy();
      expect(findByText('Evolution Chain:')).toBeTruthy();
      expect(findByText('ivysaur')).toBeTruthy();
    }, { timeout: 10000 });

    // Test add to favorites
    fireEvent.press(getByText('Add to Favorites'));
    expect(addFavorite).toHaveBeenCalledWith(mockPokemon);

    // Test remove from favorites (simulate it being a favorite)
    isFavorite.mockReturnValue(true);
    const { getByText: getByTextAfterFav } = render(
      <FavoritesContext.Provider value={{ favorites: [mockPokemon], addFavorite, removeFavorite, isFavorite }}>
        <PokemonDetailScreen route={mockRoute} />
      </FavoritesContext.Provider>
    );
    await waitFor(() => {
      fireEvent.press(getByTextAfterFav('Remove from Favorites'));
      expect(removeFavorite).toHaveBeenCalledWith(mockPokemon.id);
    }, { timeout: 10000 });
  });
});