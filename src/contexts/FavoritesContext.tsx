
import React, { createContext, useState, ReactNode } from 'react';
import { Pokemon } from '../types/pokemon';

interface FavoritesContextData {
  favorites: Pokemon[];
  addFavorite: (pokemon: Pokemon) => void;
  removeFavorite: (pokemonId: number) => void;
  isFavorite: (pokemonId: number) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextData>(
  {} as FavoritesContextData
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<Pokemon[]>([]);

  const addFavorite = (pokemon: Pokemon) => {
    setFavorites(prevFavorites => [...prevFavorites, pokemon]);
  };

  const removeFavorite = (pokemonId: number) => {
    setFavorites(prevFavorites =>
      prevFavorites.filter(pokemon => pokemon.id !== pokemonId)
    );
  };

  const isFavorite = (pokemonId: number) => {
    return favorites.some(pokemon => pokemon.id === pokemonId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
