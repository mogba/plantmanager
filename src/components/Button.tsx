import React from 'react';
import { 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    TouchableOpacityProps
} from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface ButtonProps extends TouchableOpacityProps {
    title: string
}

// Tipando Button com a interface criada acima é possível
// utilizar as propriedades de TouchableOpacityProps, 
// por exemplo a 'onPress', para realizar a navegação
export function Button({ title, ...parentProps }: ButtonProps) {
    return (
        <TouchableOpacity 
            style={styles.container}
            activeOpacity={0.7}
            {...parentProps}
        >
            <Text style={styles.text}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.green,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        color: colors.white,
        fontFamily: fonts.heading
    }
});