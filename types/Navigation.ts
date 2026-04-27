export type RootStackParamList = {
    Pokedex: undefined; // A tela Pokedex não recebe parâmetros
    PokemonDetails: { pokemonId: number }; // A tela de detalhes recebe o ID do Pokémon como parâmetro
};
