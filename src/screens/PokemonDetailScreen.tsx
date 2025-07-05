
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../AppNavigator';
import { Pokemon, PokemonSpecies, EvolutionChain, ChainLink } from '../types/pokemon';
import { getPokemonDetail, getPokemonSpecies, getEvolutionChain } from '../services/api';
import { FavoritesContext } from '../contexts/FavoritesContext';

type PokemonDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'PokemonDetail'
>;

type Props = {
  route: PokemonDetailScreenRouteProp;
};

const PokemonDetailScreen = ({ route }: Props) => {
  const { pokemon } = route.params;
  const [detailedPokemon, setDetailedPokemon] = useState<Pokemon | null>(null);
  const [speciesData, setSpeciesData] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [loading, setLoading] = useState(true);
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const detail = await getPokemonDetail(pokemon.name);
        setDetailedPokemon(detail);

        const species = await getPokemonSpecies(detail.species.url);
        setSpeciesData(species);

        const evolution = await getEvolutionChain(species.evolution_chain.url);
        setEvolutionChain(evolution);
      } catch (error) {
        console.error("Error fetching pokemon details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [pokemon.name]);

  const renderEvolutionChain = (chainLink: ChainLink) => {
    return (
      <View style={styles.evolutionContainer}>
        <Text style={styles.evolutionName}>{chainLink.species.name}</Text>
        {chainLink.evolves_to.map((link, index) => (
          <View key={index} style={styles.evolutionArrowContainer}>
            <Text style={styles.evolutionArrow}>→</Text>
            {renderEvolutionChain(link)}
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!detailedPokemon) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error loading Pokémon details.</Text>
      </View>
    );
  }

  const isFav = isFavorite(detailedPokemon.id);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{detailedPokemon.name}</Text>
        <TouchableOpacity
          onPress={() =>
            isFav ? removeFavorite(detailedPokemon.id) : addFavorite(detailedPokemon)
          }
        >
          <Text style={styles.favoriteButton}>
            {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>
      </View>
      <Image
        style={styles.image}
        source={{ uri: detailedPokemon.sprites.front_default }}
      />
      <Text style={styles.detailText}>Type: {detailedPokemon.types.map(t => t.type.name).join(', ')}</Text>
      <Text style={styles.detailText}>Height: {detailedPokemon.height / 10} m</Text>
      <Text style={styles.detailText}>Weight: {detailedPokemon.weight / 10} kg</Text>
      <Text style={styles.detailText}>Abilities:</Text>
      {detailedPokemon.abilities.map((a, index) => (
        <Text key={index} style={styles.abilityText}>- {a.ability.name}</Text>
      ))}

      {speciesData?.flavor_text_entries && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category:</Text>
          <Text>{speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text}</Text>
        </View>
      )}

      {evolutionChain && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evolution Chain:</Text>
          {renderEvolutionChain(evolutionChain.chain)}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  favoriteButton: {
    color: 'blue',
    fontSize: 16,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  abilityText: {
    marginLeft: 10,
    marginBottom: 3,
  },
  section: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  evolutionContainer: {
    marginLeft: 10,
  },
  evolutionName: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  evolutionArrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  evolutionArrow: {
    fontSize: 20,
    marginHorizontal: 5,
  },
});

export default PokemonDetailScreen;
