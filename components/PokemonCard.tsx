import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pokemon, RootStackParamList } from '../types/Pokemon';
import { capitalize } from '../utils/format';

interface Props {
    pokemon: Pokemon;
}

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const PokemonCard = ({ pokemon }: Props) => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Details', { pokemon })}
        >
            <Image source={{ uri: pokemon.image }} style={styles.image} />
            {/* Aplicando a capitalização no nome */}
            <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        margin: 8,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    image: { width: 100, height: 100 },
    name: { marginTop: 8, fontWeight: 'bold' },
});