import React, { useState } from "react";
import { 
    SafeAreaView, 
    StyleSheet, 
    Text, 
    TextInput, 
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
    TouchableOpacity,
    Alert
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Button } from "../components/Button";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function UserIdentification() {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [userName, setUserName] = useState<string>();
    const [showModal, setShowModal] = useState(false);

    function handleInputBlur() {
        setIsFocused(false);
        setIsFilled(!!userName);
    }

    function handleInputFocus() {
        setIsFocused(true);
    }

    function handleInputChange(value: string) {
        setIsFilled(!!value && value.trim().length > 0);
        setUserName(value);
    }

    const navigation = useNavigation();

    async function handleSubmit() {
        if (!userName || userName.trim().length === 0) {
            return setShowModal(true);
        }

        try {
            await AsyncStorage.setItem('@plantmanager:userName', userName);

            navigation.navigate(
                'Confirmation', 
                {
                    title: 'Prontinho!',
                    subtitle: 'Agora vamos começar a cuidar das suas\nplantinhas com muito carinho.',
                    icon: 'smile',
                    buttonTitle: 'Começar',
                    nextScreen: 'PlantSelection'
                }
            );
        } catch (error) {
            // Trocar o Alert pelo Modal criado em UserIdentification.
            Alert.alert('Não conseguimos salvar seu nome nome. Por favor, tente novamente. 🤪');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <View style={styles.header}>
                                <Text style={styles.emoji}>
                                    { isFilled ? '😉' : '🤔' }
                                </Text>

                                <Text style={styles.question}>
                                    Como podemos{'\n'}
                                    chamar você?
                                </Text>
                            </View>

                            <TextInput 
                                style={[
                                    styles.input,
                                    (isFocused 
                                        || isFilled) 
                                        && { borderColor: colors.green }
                                ]}
                                placeholder='Digite seu nome'
                                onBlur={handleInputBlur}
                                onFocus={handleInputFocus}
                                onChangeText={handleInputChange}
                            />

                            <Modal
                                animationType='fade'
                                transparent={true}
                                visible={showModal}
                            >
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Text style={styles.modalText}>
                                            Por favor, nos diga seu nome! 🥺
                                        </Text>
                                        <View style={styles.modalButtonView}>
                                            <TouchableOpacity
                                                style={styles.modalButton}
                                                activeOpacity={0.7}
                                                onPress={() => setShowModal(false)}
                                            >
                                                <Text style={styles.modalButtonText}>
                                                    OK
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>

                            <View style={styles.footer}>
                                <Button 
                                    title='Confirmar'
                                    onPress={handleSubmit}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-around'
    },
    content: {
        flex: 1,
        width: '100%'
    },
    form: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 54
    },
    header: { 
        alignItems: 'center'
    },
    emoji: {
        fontSize: 48
    },
    question: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 20
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.gray,
        color: colors.heading,
        width: '100%',
        fontSize: 18,
        marginTop: 50,
        padding: 10,
        textAlign: 'center'
    },
    footer: {
        marginTop: 40,
        width: '100%',
        paddingHorizontal: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        backgroundColor: colors.background,
        borderRadius: 16,
        margin: 20,
        padding: 18,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        alignItems: 'center',
        fontFamily: fonts.text,
        fontSize: 22,
        textAlign: 'center',
        padding: 10
    },
    modalButtonView: {
        alignItems: 'flex-end',
    },
    modalButton: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'flex-end',
        padding: 10
    },
    modalButtonText: {
        fontFamily: fonts.heading,
        color: colors.green,
        fontSize: 18
    }
});