import { GlobalStyles } from "@/constants/Colors";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";

const Notification = ({
    message,
    type = "info",
    duration = 2000,
    onHide,
}: {
    message: string;
    type?: "success" | "error" | "info" | "warning";
    duration?: number;
    onHide: () => void;
}) => {
    const opacity = useRef(new Animated.Value(0)).current;

    const colors = {
        success: GlobalStyles.green,
        error: GlobalStyles.red,
        info: GlobalStyles.blue,
        warning: GlobalStyles.orange,
    };

    useEffect(() => {
        opacity.stopAnimation();

        Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                onHide();
            });
        }, duration);

        return () => {
            clearTimeout(timer);
            opacity.stopAnimation();
        };
    }, [message, duration]);

    return (
        <Animated.View style={[
            styles.container,
            {
                backgroundColor: colors[type],
                opacity,
                transform: [{
                    translateY: opacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0]
                    })
                }]
            }
        ]}>
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        fontFamily: GlobalStyles.font,
        top: 20,
        alignSelf: 'center',
        borderRadius: 8,
        padding: 15,
        zIndex: 9999,
        elevation: 9999,
        maxWidth: 300,
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
    },
});

export default Notification;