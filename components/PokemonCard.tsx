// components/PokemonCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Pokemon } from '../types/Pokemon';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation';
import { capitalize } from '../utils/format';

interface Props {
    pokemon: Pokemon;
}

type PokemonCardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PokemonDetails'>;

export const PokemonCard = ({ pokemon }: Props) => {
    const navigation = useNavigation<PokemonCardNavigationProp>();

    const handlePress = () => {
        navigation.navigate('PokemonDetails', { pokemonId: pokemon.id });
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.touchableCard}>
            {/* View interna que mantém a estrutura e estilização visual original do card. */}
            <View style={styles.cardInner}>
                <Image source= style={styles.image} />
                <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchableCard: {
        flex: 1,
        margin: 8,
    },
    cardInner: {
        backgroundColor: '#e0e0e0',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        flex: 1,
    },
    image: { width: 80, height: 80 },
    name: { marginTop: 8, fontWeight: 'bold' },
});
