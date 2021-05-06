import React from 'react';
import { 
    SafeAreaView, 
    Text, 
    Image, 
    TouchableOpacity, 
    StyleSheet,
    Dimensions, // Para trabalhar com responsividade na imagem de fundo
    View
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/core';

// Typescript lança o erro "Cannot find module 
// '../assets/watering.png' or its corresponding 
// type declarations.".
// > Para correção, verificar o arquivo "custom.d.ts".
import wateringImage from '../assets/watering.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Welcome() {
    const navigation = useNavigation();

    function handleStart() {
        navigation.navigate('UserIdentification');
    }

    return (
        // <View>
        // Este componente não leva em conta os 
        // notches nas telas dos celulares.
        // Ao invés dele, utilizar SafeAreaView.
        // </View>
        // No entanto, o componente View pode ser tranquilamente 
        // utilizado dentro de SafeAreaView.
        <SafeAreaView style={styles.container}>
            <View style={styles.wrapper}>
                <Text style={styles.title}>
                    Gerencie{'\n'}
                    suas plantas de{'\n'}
                    forma fácil
                </Text>

                <Image 
                    source={wateringImage} 
                    style={styles.image}
                    resizeMode='contain'
                />

                <Text style={styles.subtitle}>
                    Não esqueça mais de regar suas plantas.{'\n'}
                    Lembraremos você sempre que precisar.
                </Text>
                
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={handleStart}
                >
                    <Feather 
                        name='chevron-right'
                        style={styles.buttonIcon}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 20
    },
    title:  {
        fontSize: 28,
        textAlign: 'center',
        color: colors.heading,
        marginTop: 58,
        fontFamily: fonts.heading,
        lineHeight: 36
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 18,
        paddingHorizontal: 20,
        color: colors.heading,
        fontFamily: fonts.text
    },
    image: {
        height: Dimensions.get('window').width * 0.7
        // Definição da altura de forma responsiva,
        // de acordo com as dimensões do dispositivo
    },
    button: {
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 30,
        height: 56,
        width: 56
    },
    buttonIcon: {
        color: colors.white,
        fontSize: 30
    }
});