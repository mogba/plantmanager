import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from "@react-navigation/core";
import { PlantProps } from '../libs/storage';

import { Header } from '../components/Header';
import { EnvironmentButton } from '../components/EnvironmentButton';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import api from '../services/api';

interface EnvironmentProps {
    key: string,
    title: string
}

export function PlantSelection() {
    const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    const [activeEnvironment, setActiveEnvironment] = useState('all');
    const [isLoadingPlants, setIsLoadingPlants] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const navigation = useNavigation();

    async function fetchPlants() {
        const { data } = await api
            .get(`plants?_sort=name&_order=asc&_page=${currentPage}&_limit=8`);

        if (!data) {
            return setIsLoadingPlants(true);
        }
        
        if (currentPage > 1) {
            setPlants(oldValue => [...oldValue, ...data]);
            setFilteredPlants(oldValue => [...oldValue, ...data]);
        }
        else {
            setPlants(data);
            setFilteredPlants(data);
        }

        setIsLoadingPlants(false);
        setIsLoadingMore(false);
    }

    function handleFetchMore(distance: number) {
        if (distance < 1) // Está rolando para cima
            return;

        setIsLoadingMore(true);
        setCurrentPage(oldValue => oldValue + 1);
        fetchPlants();
    }

    function handleActiveEnvironment(key: string) {
        setActiveEnvironment(key);

        if (key == 'all')
            return setFilteredPlants(plants);

        setFilteredPlants(plants.filter(plant => 
            plant.environments.includes(key)
        ));
    }

    function handlePlantSelect(plant: PlantProps) {
        navigation.navigate('PlantSave', { plant });
    }

    useEffect(() => {
        async function fetchEnvironment() {
            const { data } = await api
                .get('plants_environments?_sort=title&_order=asc');
            setEnvironments([
                {
                    key: 'all',
                    title: 'Todos'
                },
                ...data
            ]);
        }

        fetchEnvironment();
    }, []);

    useEffect(() => {
        fetchPlants();
    }, []);

    if (isLoadingPlants) {
        return <Load />
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />

                <Text style={styles.title}>
                    Em qual ambiente
                </Text>
                <Text style={styles.subtitle}>
                    você quer colocar sua planta?
                </Text>
            </View>

            <View>
                <FlatList
                    data={environments}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({ item }) => (
                        <EnvironmentButton
                            title={item.title}
                            isActive={item.key === activeEnvironment}
                            onPress={() => handleActiveEnvironment(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.environmentList}
                />
            </View>

            <View style={styles.plants}>
                <FlatList
                    contentContainerStyle={styles.plantList}
                    data={filteredPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardPrimary 
                            data={item} 
                            onPress={() => handlePlantSelect(item)} 
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    // Quando chegar nesta distância...
                    onEndReachedThreshold={0.1}
                    // Executa esta ação.
                    onEndReached={({ distanceFromEnd }) =>
                        handleFetchMore(distanceFromEnd)
                    }
                    // Mostra um componente para
                    // indicar que está carregando.
                    ListFooterComponent={
                        isLoadingMore 
                        ? <ActivityIndicator color={colors.green} />
                        : <></>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        padding: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },
    environmentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        paddingHorizontal: 30,
        marginBottom: 30
    },
    plants: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center'
    },
    plantList: {
        paddingBottom: 30
    }
});