
import React from 'react';
import { render, act } from '@testing-library/react-native';
import { FavoritesProvider, FavoritesContext } from '../../src/contexts/FavoritesContext';
import { Pokemon } from '../../src/types/pokemon';

describe('FavoritesContext', () => {
  it('should add and remove favorites', () => {
    const pokemon: Pokemon = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      sprites: { front_default: '' },
      types: [],
      abilities: [],
      species: { name: '', url: '' },
    };
    let contextValue: any;

    render(
      <FavoritesProvider>
        <FavoritesContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </FavoritesContext.Consumer>
      </FavoritesProvider>
    );

    // Add favorite
    act(() => {
      contextValue.addFavorite(pokemon);
    });
    expect(contextValue.favorites).toEqual([pokemon]);
    expect(contextValue.isFavorite(1)).toBe(true);

    // Remove favorite
    act(() => {
      contextValue.removeFavorite(1);
    });
    expect(contextValue.favorites).toEqual([]);
    expect(contextValue.isFavorite(1)).toBe(false);
  });
});
