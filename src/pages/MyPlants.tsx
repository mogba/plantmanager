import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    Alert
} from 'react-native';
import { pt } from 'date-fns/locale';
import { formatDistance } from 'date-fns';
import { loadPlants, PlantProps, removePlant } from '../libs/storage';

import { Header } from "../components/Header";
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';

import waterdrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyPlants() {
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [isLoadingPlants, setIsLoadingPlants] = useState(true);
    const [nextWaterTime, setNextWaterTime] = useState<string>();

    useEffect(() => {
        async function loadStorageData() {
            const storagePlants = await loadPlants();

            const nextTime = formatDistance(
                new Date(storagePlants[0].date_time_notification).getTime(),
                new Date().getTime(),
                { locale: pt }
            );

            setNextWaterTime(
                `Não esqueça de regar a ${storagePlants[0].name} em ${nextTime}`
            );

            setMyPlants(storagePlants);
            setIsLoadingPlants(false);
        }

        loadStorageData();
    }, []);

    function handleRemove(plant: PlantProps) {
        Alert.alert(
            'Remover',
            `Desejar remover ${plant.name}?`,
            [
                {
                    text: 'Não',
                    style: 'cancel'
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            await removePlant(plant.id);

                            setMyPlants((oldData) => 
                                oldData.filter((item) => item.id !== plant.id)
                            );
                        }
                        catch (error) {
                            Alert.alert('Não foi possível remover a planta.');
                        }
                    }
                }
            ]);
    }

    if (isLoadingPlants) {
        return <Load />;
    }

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.spotlight}>
                <Image
                    source={waterdrop}
                    style={styles.spotlightImage}
                />
                <Text style={styles.spotlightText}>
                    {nextWaterTime}
                </Text>
            </View>

            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Próximas regadas
                </Text>

                <FlatList 
                    contentContainerStyle={styles.plantList}
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardSecondary 
                            data={item} 
                            handleRemove={() => handleRemove(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spotlightImage: {
        width: 60,
        height: 60
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        marginVertical: 20
    },
    plantList: {
        flexGrow: 1
    }
});