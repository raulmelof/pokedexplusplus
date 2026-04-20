import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/Pokemon';
import { capitalize } from '../utils/format';
import { getPokemonDescription } from '../services/api';

type DetailRouteProp = RouteProp<RootStackParamList, 'Details'>;

export const PokemonDetailScreen = () => {
    const route = useRoute<DetailRouteProp>();
    const { pokemon } = route.params;

    const [description, setDescription] = useState('');
    const [loadingDesc, setLoadingDesc] = useState(true);

    useEffect(() => {
        const fetchDescription = async () => {
            const desc = await getPokemonDescription(pokemon.id);
            setDescription(desc);
            setLoadingDesc(false);
        };
        fetchDescription();
    }, [pokemon.id]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: pokemon.image }} style={styles.image} />
                <Text style={styles.name}>{capitalize(pokemon.name)}</Text>

                <View style={styles.typesContainer}>
                    {pokemon.types.map(type => (
                        <Text key={type} style={styles.typeBadge}>{capitalize(type)}</Text>
                    ))}
                </View>
            </View>

            <View style={styles.statsCard}>
                <View style={styles.row}>
                    <Text style={styles.statLabel}>Peso:</Text>
                    <Text style={styles.statValue}>{pokemon.weight / 10} kg</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.statLabel}>Altura:</Text>
                    <Text style={styles.statValue}>{pokemon.height / 10} m</Text>
                </View>

                <Text style={styles.descTitle}>Sobre</Text>
                {loadingDesc ? (
                    <ActivityIndicator size="small" color="#e3350d" />
                ) : (
                    <Text style={styles.description}>{description}</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f1f1' },
    header: { alignItems: 'center', backgroundColor: '#e3350d', paddingBottom: 30, paddingTop: 20 },
    image: { width: 200, height: 200 },
    name: { fontSize: 32, fontWeight: 'bold', color: 'white', marginTop: 10 },
    typesContainer: { flexDirection: 'row', gap: 10, marginTop: 10 },
    typeBadge: { backgroundColor: 'rgba(255,255,255,0.3)', color: 'white', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, fontWeight: 'bold', overflow: 'hidden' },
    statsCard: { backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 15, elevation: 4, marginTop: -20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
    statLabel: { fontSize: 16, color: '#666' },
    statValue: { fontSize: 16, fontWeight: 'bold' },
    descTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    description: { fontSize: 16, color: '#444', lineHeight: 24, fontStyle: 'italic' },
});