import React from 'react';
import { Text, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import colors from '../styles/colors';

// Define o tipo específico das propriedades esperadas.
interface ButtonProps extends TouchableOpacityProps {
    title: string
}

export function TestButton({ title, ...parentProps }: ButtonProps) {
    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            {...parentProps}
        >
            <Text style={styles.buttonText}>
                { title }
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 30,
        height: 56,
        width: 56,
        paddingHorizontal: 10
    },
    buttonText: {
        color: colors.white,
        fontSize: 24
    }
});