
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonSpecies {
  evolution_chain: {
    url: string;
  };
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
  }>;
}

export interface EvolutionChain {
  baby_trigger_item: any;
  chain: ChainLink;
  id: number;
}

export interface ChainLink {
  evolution_details: Array<any>;
  evolves_to: Array<ChainLink>;
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
}
