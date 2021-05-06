import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { SvgFromUri } from "react-native-svg";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { useRoute, useNavigation } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';
import { PlantProps, savePlant } from "../libs/storage";

import { Button } from "../components/Button";

import waterdrop from '../assets/waterdrop.png';
import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface Params {
    plant: PlantProps
}

export function PlantSave() {
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(Platform.OS == 'ios');

    const route = useRoute();
    const { plant } = route.params as Params;

    const navigation = useNavigation();

    function handleChangeDateTime(event: Event, dateTime: Date | undefined) {
        if (Platform.OS == 'android') {
            setShowDateTimePicker(oldState => !oldState);
        }

        if (dateTime && isBefore(dateTime, new Date())) {
            setSelectedDateTime(new Date());
            // Trocar o Alert pelo Modal criado em UserIdentification.
            Alert.alert('Esse horário já passou!');
        }

        if (dateTime) {
            setSelectedDateTime(dateTime);
        }
    }

    function handleOpenDateTimePicker_Android() {
        setShowDateTimePicker(oldState => !oldState);
    }

    async function handleSave() {
        try {
            console.log(selectedDateTime);

            await savePlant({
                ...plant,
                date_time_notification: selectedDateTime
            });

            navigation.navigate(
                'Confirmation', 
                {
                    title: 'Tudo certo!',
                    subtitle: 'Fique tranquilo que avisaremos quando\nchegar a hora de cuidar da sua plantinha.',
                    icon: 'hug',
                    buttonTitle: 'Show!',
                    nextScreen: 'MyPlants'
                }
            );
        }
        catch (error) {
            // Trocar o Alert pelo Modal criado em UserIdentification.
            Alert.alert('Não foi possível salvar.');
        }
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <View style={styles.container}>
                <View style={styles.plantInfo}>
                    <SvgFromUri
                        uri={plant.photo}
                        height={150}
                        width={150}
                    />

                    <Text style={styles.plantName}>
                        {plant.name}
                    </Text>
                    <Text style={styles.plantAbout}>
                        {plant.about}
                    </Text>
                </View>

                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <Image
                            source={waterdrop}
                            style={styles.tipImage}
                        />
                        <Text style={styles.tipText}>
                            {plant.water_tips}
                        </Text>
                    </View>
                    
                    <Text style={styles.alertLabel}>
                        Escolha o melhor horário para ser lembrado:
                    </Text>

                    {
                        showDateTimePicker && (
                            <DateTimePicker 
                                value={selectedDateTime}
                                mode='time'
                                display='spinner'
                                onChange={handleChangeDateTime}
                            />
                        )
                    }

                    {
                        Platform.OS == 'android' && (
                            <TouchableOpacity
                                style={styles.dateTimePickerButton_Android}
                                onPress={() => handleOpenDateTimePicker_Android()}
                            >
                                <Text style={styles.dateTimePickerText_Android}>
                                    {`Mudar horário - ${format(selectedDateTime, 'HH:mm')}`}
                                </Text>
                            </TouchableOpacity>
                        )
                    }

                    <Button 
                        title='Cadastrar planta' 
                        onPress={handleSave} 
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:  {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape
    },
    plantName: {
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15
    },
    plantAbout: {
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10
    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        // Se não for iPhone, getBottomSpace retorna 0. Neste caso, usa 20.
        paddingBottom: getBottomSpace() || 20
    },
    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60
    },
    tipImage: {
        width: 56,
        height: 56
    },
    tipText: {
        flex: 1, // Antes de adicionar isso, o texto ficava para fora da tela.
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'justify'
    },
    alertLabel: {
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5
    },
    dateTimePickerButton_Android: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40
    },
    dateTimePickerText_Android: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    }
});