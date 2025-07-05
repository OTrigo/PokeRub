import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getPokemonList, getPokemonDetail, getPokemonSpecies, getEvolutionChain } from '../../src/services/api';

const mock = new MockAdapter(axios);

describe('PokeAPI Service', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should fetch a list of pokemons', async () => {
    const data = { results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }] };
    mock.onGet('https://pokeapi.co/api/v2/pokemon?offset=0&limit=1').reply(200, data);

    const result = await getPokemonList(0, 1);
    expect(result).toEqual(data.results);
  });

  it('should fetch pokemon detail', async () => {
    const data = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        back_default: null,
        front_shiny: null,
        back_shiny: null,
        other: {
          dream_world: { front_default: null, front_female: null },
          home: { front_default: null, front_female: null, front_shiny: null, front_shiny_female: null },
          'official-artwork': { front_default: null, front_shiny: null },
          showdown: { back_default: null, back_female: null, back_shiny: null, back_shiny_female: null, front_default: null, front_female: null, front_shiny: null, front_shiny_female: null },
        },
        versions: {},
      },
      types: [
        { slot: 1, type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' } },
        { slot: 2, type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' } },
      ],
      abilities: [
        { ability: { name: 'overgrow', url: 'https://pokeapi.co/api/v2/ability/65/' }, is_hidden: false, slot: 1 },
        { ability: { name: 'chlorophyll', url: 'https://pokeapi.co/api/v2/ability/34/' }, is_hidden: true, slot: 3 },
      ],
      species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
      base_experience: 64,
      cries: { latest: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1.ogg', legacy: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/1.ogg' },
      forms: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-form/1/' }],
      game_indices: [],
      held_items: [],
      is_default: true,
      location_area_encounters: 'https://pokeapi.co/api/v2/pokemon/1/encounters',
      moves: [],
      order: 1,
      past_abilities: [],
      past_types: [],
      stats: [],
    };
    mock.onGet('https://pokeapi.co/api/v2/pokemon/bulbasaur').reply(200, data);

    const result = await getPokemonDetail('bulbasaur');
    expect(result).toEqual(data);
  });

  it('should fetch pokemon species data', async () => {
    const data = {
      evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
      flavor_text_entries: [
        { flavor_text: 'A strange seed was planted.', language: { name: 'en', url: '' } },
      ],
    };
    mock.onGet('https://pokeapi.co/api/v2/evolution-chain/1/').reply(200, data);

    const result = await getPokemonSpecies('https://pokeapi.co/api/v2/evolution-chain/1/');
    expect(result).toEqual(data);
  });

  it('should fetch evolution chain data', async () => {
    const data = {
      baby_trigger_item: null,
      chain: {
        evolution_details: [],
        evolves_to: [
          { species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' }, evolves_to: [], is_baby: false, evolution_details: [] },
        ],
        is_baby: false,
        species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
      },
      id: 1,
    };
    mock.onGet('https://pokeapi.co/api/v2/evolution-chain/1/').reply(200, data);

    const result = await getEvolutionChain('https://pokeapi.co/api/v2/evolution-chain/1/');
    expect(result).toEqual(data);
  });
});