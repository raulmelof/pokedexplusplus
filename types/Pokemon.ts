export interface PokemonListItem {
    name: string;
    url: string;
}

export interface Pokemon {
    id: number;
    name: string;
    image: string;
    types: string[];
    weight: number;
    height: number;
}

export type RootStackParamList = {
    Home: undefined;
    Details: { pokemon: Pokemon };
};