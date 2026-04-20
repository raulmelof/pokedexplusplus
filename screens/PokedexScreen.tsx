import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPokemons, getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';

export const PokedexScreen = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [search, setSearch] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Lógica do Exercício 3: Estados de paginação
    const [offset, setOffset] = useState(0);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Extraindo a área segura do topo da tela
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError('');

                const list = await getPokemons(30, 0); // Começa do zero
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

    // Lógica do Exercício 3: Buscar mais Pokémons
    const loadMorePokemons = async () => {
        // Evita chamadas duplas e não busca se o usuário estiver pesquisando algo específico
        if (isFetchingMore || isLoading || search.trim() !== '') return;

        try {
            setIsFetchingMore(true);
            const newOffset = offset + 30;

            const list = await getPokemons(30, newOffset);
            const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));

            // Junta os antigos com os novos
            setPokemons(prev => [...prev, ...details]);
            setOffset(newOffset);

        } catch (err) {
            console.error("Erro ao buscar mais Pokémons", err);
        } finally {
            setIsFetchingMore(false);
        }
    };

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

    // Lógica do Exercício 3: Loading de rodapé
    const renderFooter = () => {
        if (!isFetchingMore) return null;
        return (
            <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color="#e3350d" />
            </View>
        );
    };

    // Se estiver carregando pela primeira vez e não tiver dados, mostra o loading grandão
    if (isLoading && pokemons.length === 0) {
        return (
            <View style={[styles.container, styles.center, { paddingTop: insets.top + 20 }]}>
                <ActivityIndicator size="large" color="#e3350d" />
                <Text style={styles.loadingText}>Carregando Pokémons...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.center, { paddingTop: insets.top + 20 }]}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        /* Aplicando o insets.top dinamicamente no container principal */
        <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
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

                // Propriedades do Exercício 3
                onEndReached={loadMorePokemons}
                onEndReachedThreshold={0.1} // Dispara quando chegar a 10% do fim da lista
                ListFooterComponent={renderFooter}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    /* O paddingTop fixo de 60 foi removido daqui */
    container: { flex: 1, paddingHorizontal: 16 },
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
    footerLoading: { paddingVertical: 20, alignItems: 'center' },
});