import React from 'react';
import {
    StyleSheet,
    Text
} from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentButtonProps extends RectButtonProps {
    title: string,
    isActive?: boolean
    // No TypeScript, para fazer do argumento
    // opcional, basta utilizar o "?"
}

export function EnvironmentButton({
    title,
    isActive = false, // Valor padrão do parâmetro
    ...parentProps
}: EnvironmentButtonProps) {
    return (
        <RectButton 
            style={[
                styles.button,
                isActive && styles.buttonActive
            ]}
            {...parentProps}
        >
            <Text style={[
                styles.text,
                isActive && styles.textActive
            ]}>
                {title}
            </Text>
        </RectButton>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.shape,
        width: 76,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginHorizontal: 5
    },
    buttonActive: {
        backgroundColor: colors.green_light
    },
    text: {
        color: colors.heading,
        fontFamily: fonts.text
    },
    textActive: {
        color: colors.green_dark,
        fontFamily: fonts.heading
    }
});
