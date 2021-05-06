import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Outra forma de evitar que componentes fiquem embaixo da barra de status
// import { getStatusBarHeight } from 'ract-native-iphone-x-helper';

import profilePic from '../assets/profile-pic.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header() {
    const [userName, setUserName] = useState<string>();

    useEffect(() => {
        async function loadUserName() {
            const loadedUserName = await AsyncStorage.getItem('@plantmanager:userName');
            setUserName(loadedUserName || '');
        }

        loadUserName();
    }, [userName]);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.greeting}>Olá,</Text>
                <Text style={styles.userName}>{userName}</Text>
            </View>

            <Image 
                source={profilePic}
                style={styles.image}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Constants.statusBarHeight,
        // Quando 'ract-native-iphone-x-helper' for utilizado:
        // marginTop: getStatusBarHeight(),
    },
    greeting: {
        fontSize: 32,
        fontFamily: fonts.text,
        color: colors.heading
    },
    userName: {
        fontSize: 32,
        fontFamily: fonts.heading,
        color: colors.heading,
        lineHeight: 40
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 40
    }
});