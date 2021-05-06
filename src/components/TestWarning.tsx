import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Modal } from "react-native";

export function TestWarning() {
    const { Navigator, Screen } = createStackNavigator();
  
    return (
        <NavigationContainer>
            <Navigator
                headerMode='none'
                screenOptions={{ animationEnabled: false }}
                mode='modal'
            >
                <Screen
                    name='Alert'
                    component={Modal}
                    options={{
                        animationEnabled: true,
                        cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.15)' },
                        cardOverlayEnabled: true,
                        cardStyleInterpolator: ({ current: { progress } }) => {
                            return {
                                cardStyle: {
                                    opacity: progress.interpolate({
                                        inputRange: [0, 0.5, 0.9, 1],
                                        outputRange: [0, 0.24, 0.7, 1]
                                    })
                                },
                                overlayStyle: {
                                    opacity: progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, 0.5],
                                        extrapolate: 'clamp'
                                    })
                                }
                            };
                        }
                    }}
                />
            </Navigator>
        </NavigationContainer>
    );
}
