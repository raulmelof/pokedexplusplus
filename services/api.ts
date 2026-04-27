// services/api.ts
import axios from 'axios';
import { Pokemon, PokemonListItem } from '../types/Pokemon'; //

const API_BASE = 'https://pokeapi.co/api/v2'; //

export async function getPokemons(limit: number): Promise<PokemonListItem[]> {
    const res = await axios.get(`${API_BASE}/pokemon?limit=${limit}`);
    return res.data.results;
}

export async function getPokemonDetails(url: string): Promise<Pokemon> {
    const res = await axios.get(url);
    return {
        id: res.data.id,
        name: res.data.name,
        image: res.data.sprites.front_default,
        types: res.data.types.map((t: any) => t.type.name),
    };
}

export async function getPokemonById(id: number): Promise<Pokemon> {
    const res = await axios.get(`${API_BASE}/pokemon/${id}`);
    return {
        id: res.data.id,
        name: res.data.name,
        image: res.data.sprites.front_default,
        types: res.data.types.map((t: any) => t.type.name),
        // Aqui poderíamos buscar e mostrar dados opcionais, customizando nosso tipo Pokemon. 
        // Por exemplo, poderíamos buscar:
        // height: res.data.height,
        // weight: res.data.weight,
        // abilities: res.data.abilities.map((a: any) => a.ability.name),
    };
}
