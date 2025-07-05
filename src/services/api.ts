
import axios from 'axios';
import { Pokemon, PokemonSpecies, EvolutionChain } from '../types/pokemon';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
});

export const getPokemonList = async (offset: number, limit: number) => {
  const response = await api.get(`/pokemon?offset=${offset}&limit=${limit}`);
  return response.data.results;
};

export const getPokemonDetail = async (name: string) => {
  const response = await api.get<Pokemon>(`/pokemon/${name}`);
  return response.data;
};

export const getPokemonSpecies = async (url: string) => {
  const response = await api.get<PokemonSpecies>(url);
  return response.data;
};

export const getEvolutionChain = async (url: string) => {
  const response = await api.get<EvolutionChain>(url);
  return response.data;
};

export default api;
