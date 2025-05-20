import { ThemedText } from "@/components/ThemedText";
import { GlobalStyles } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Animated, Image, StyleSheet, TouchableOpacity, View } from "react-native";

const carouselItems = [
    {
        image: "https://inkscape.app/wp-content/uploads/imagen-vectorial.webp",
        name: "Juan Pérez",
        description: "Desarrollador Frontend con 5 años de experiencia en React Native.",
        contact: "juan.perez@ejemplo.com",
    },
    {
        image: "https://inkscape.app/wp-content/uploads/imagen-vectorial.webp",
        name: "María García",
        description: "Especialista en UI/UX y diseño accesible para apps móviles.",
        contact: "maria.garcia@ejemplo.com",
    },
    {
        image: "httpss://inkscape.app/wp-content/uploads/imagen-vectorial.webp",
        name: "Andrés López",
        description: "Ingeniero de software centrado en performance y arquitectura.",
        contact: "andres.lopez@ejemplo.com",
    },
];

const ImageCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [imageError, setImageError] = React.useState(false);
    const progress = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => setImageError(false), [currentIndex]);

    const startAnimation = React.useCallback(() => {
        progress.setValue(0);
        Animated.timing(progress, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: false,
        }).start(({ finished }) => finished && handleNext());
    }, [progress]);

    const handlePrev = () => {
        progress.stopAnimation();
        setCurrentIndex(i => (i - 1 + carouselItems.length) % carouselItems.length);
    };
    const handleNext = React.useCallback(() => {
        progress.stopAnimation();
        setCurrentIndex(i => (i + 1) % carouselItems.length);
    }, [carouselItems.length]);
    React.useEffect(() => startAnimation(), [currentIndex, startAnimation]);

    return (
        <View style={styles.carouselContainer}>
            <View style={styles.carouselItem}>
                <Image
                    source={
                        imageError
                            ? require('@/assets/images/banner.png')
                            : { uri: carouselItems[currentIndex].image }
                    }
                    style={styles.carouselItemImage}
                    onError={() => setImageError(true)}
                />
                <View style={styles.carouselItemContent}>
                    <ThemedText style={styles.carouselItemName}>
                        {carouselItems[currentIndex].name}
                    </ThemedText>
                    <ThemedText style={styles.carouselItemDescription}>
                        {carouselItems[currentIndex].description}
                    </ThemedText>
                    <ThemedText style={styles.carouselItemContact}>
                        {carouselItems[currentIndex].contact}
                    </ThemedText>
                </View>
            </View>
            <View style={styles.carouselButtons}>
                <TouchableOpacity onPress={handlePrev} style={styles.carouselButton}>
                    <MaterialIcons name="chevron-left" size={32} color={GlobalStyles.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNext} style={styles.carouselButton}>
                    <MaterialIcons name="chevron-right" size={32} color={GlobalStyles.white} />
                </TouchableOpacity>
            </View>
            <View style={styles.progressBarContainer}>
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            width: progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0%", "100%"],
                            }),
                        },
                    ]}
                />
            </View>
            <View style={styles.dotsContainer}>
                {carouselItems.map((_, idx) => (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => { progress.stopAnimation(); setCurrentIndex(idx); }}
                        style={[styles.dot, currentIndex === idx && styles.activeDot]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    carouselContainer: { width: "80%", alignItems: "center" },
    carouselItem: {
        width: "100%", flexDirection: "row",
        backgroundColor: GlobalStyles.lightGrey,
        borderRadius: 25, overflow: "hidden", height: 200,
    },
    carouselItemImage: { width: "40%", height: "100%" },
    carouselItemContent: { width: "60%", padding: 16, justifyContent: "center" },
    carouselItemName: { fontSize: 20, fontFamily: GlobalStyles.fontBold, color: GlobalStyles.darkGrey, marginBottom: 8 },
    carouselItemDescription: { fontSize: 16, color: GlobalStyles.grey, marginBottom: 8 },
    carouselItemContact: { fontSize: 14, color: GlobalStyles.blue },
    carouselButtons: {
        position: "absolute", left: 0, right: 0, top: "40%",
        flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20,
    },
    carouselButton: { backgroundColor: "rgba(0,0,0,0.3)", padding: 5, borderRadius: 20 },
    progressBarContainer: {
        position: "absolute", bottom: 10, height: 4, width: "10%",
        backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 2,
    },
    progressBar: { height: "100%", backgroundColor: GlobalStyles.blue, borderRadius: 2 },
    dotsContainer: { position: "absolute", bottom: 20, flexDirection: "row" },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "rgba(0,0,0,0.3)", marginHorizontal: 5 },
    activeDot: { backgroundColor: GlobalStyles.blue },
});

export default ImageCarousel;