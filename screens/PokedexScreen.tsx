import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { getPokemons, getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';

export const PokedexScreen = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [search, setSearch] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError('');

                const list = await getPokemons(30);
                const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));
                setPokemons(details);

            } catch (err) {
                setError('Falha ao carregar Pokémons. Verifique sua conexão.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filtered = pokemons.filter(p => p.name.includes(search.toLowerCase()));

    // Lógica do Exercício 2: Renderiza a mensagem de lista vazia
    const renderEmptyList = () => {
        if (isLoading) return null;

        if (search.trim() !== '') {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum Pokémon encontrado para '{search}'</Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum Pokémon para exibir no momento.</Text>
            </View>
        );
    };

    // Se estiver carregando pela primeira vez e não tiver dados, mostra o loading grandão
    if (isLoading && pokemons.length === 0) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#e3350d" />
                <Text style={styles.loadingText}>Carregando Pokémons...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pokédex</Text>
            <TextInput
                placeholder="Buscar pokémon..."
                style={styles.input}
                onChangeText={setSearch}
            />
            <FlatList
                data={filtered}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                renderItem={({ item }) => <PokemonCard pokemon={item} />}
                ListEmptyComponent={renderEmptyList}
                contentContainerStyle={filtered.length === 0 ? styles.centerList : undefined}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
    center: { justifyContent: 'center', alignItems: 'center' },
    centerList: { flexGrow: 1, justifyContent: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
    input: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    loadingText: { marginTop: 10, fontSize: 16, color: '#333' },
    errorText: { color: 'red', textAlign: 'center', fontSize: 16 },
    emptyContainer: { alignItems: 'center', padding: 20 },
    emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },
});