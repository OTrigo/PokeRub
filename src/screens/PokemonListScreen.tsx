
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { getPokemonList } from '../services/api';
import { Pokemon } from '../types/pokemon';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../AppNavigator';

type PokemonListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PokemonList'
>;

type Props = {
  navigation: PokemonListScreenNavigationProp;
};

const PokemonListScreen = ({ navigation }: Props) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const fetchPokemons = async () => {
    try {
      const results = await getPokemonList(offset, limit);
      const detailedPokemons = await Promise.all(
        results.map(async (p: { name: string, url: string }) => {
          const response = await fetch(p.url);
          return response.json();
        })
      );
      setPokemons(prevPokemons => [...prevPokemons, ...detailedPokemons]);
    } catch (error) {
      console.error("Error fetching pokemons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  const filteredPokemons = search
    ? pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      )
    : pokemons;

  const loadMorePokemons = () => {
    if (!loading) {
      setOffset(prevOffset => prevOffset + limit);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search Pokémon by name"
        value={search}
        onChangeText={setSearch}
      />
      <TouchableOpacity
        style={styles.favoritesButton}
        onPress={() => navigation.navigate('Favorites')}
      >
        <Text style={styles.favoritesButtonText}>View Favorites</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredPokemons}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('PokemonDetail', { pokemon: item })}
          >
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Type: {item.types.map(t => t.type.name).join(', ')}</Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={loadMorePokemons}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  search: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  favoritesButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  favoritesButtonText: {
    fontWeight: 'bold',
  },
  card: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PokemonListScreen;
