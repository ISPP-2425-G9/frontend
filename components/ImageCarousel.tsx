import { ThemedText } from "@/components/ThemedText";
import { GlobalStyles } from "@/constants/Colors";
import React from "react";
import { Animated, Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native";

const carouselItems = [
    {
        image: "https://i.imgur.com/vJHezRy.png",
        name: "Esquelas",
        description: "Crea y envia esquelas personalizadas tanto propias como para tus seres queridos.",
        price: "1.99€/esquela",
    },
    {
        image: "https://i.imgur.com/J8C8Oyz.png",
        name: "Mensajes",
        description: "Deja mensajes totalmente personalizados que serán enviados tras la confirmación de tu fallecimiento.",
        price: "0.99€/mes",
    },
    {
        image: "https://i.imgur.com/p0AMWXO.png",
        name: "Servicios",
        description: "Publicita tu empresa relacionada con el sector funerario (funeraria, notaría, floristería, etc.) para que más clientes puedan conocer tus servicios.",
        price: "9.99€/mes",
    },
];

const ImageCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [imageError, setImageError] = React.useState(false);
    const progress = React.useRef(new Animated.Value(0)).current;
    const { width } = Dimensions.get("window");

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
                    <ThemedText style={[styles.carouselItemDescription, width > 700 ? { height: 50 } : { height: 90 }]}>
                        {carouselItems[currentIndex].description}
                    </ThemedText>
                    <ThemedText style={styles.carouselItemContact}>
                        {carouselItems[currentIndex].price}
                    </ThemedText>
                </View>
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
    carouselContainer: { height: "100%", width: "100%", alignItems: "center", borderColor: GlobalStyles.lightGrey, borderWidth: 1, borderRadius: 25, overflow: "hidden", position: "relative", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 10.84, elevation: 2 },
    carouselItem: {
        width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
        backgroundColor: GlobalStyles.lightGrey,
        borderRadius: 25, overflow: "hidden", height: "100%",
    },
    carouselItemImage: { width: "100%", aspectRatio: 2.22, justifyContent: "flex-start", },
    carouselItemContent: { marginLeft: "2%", marginTop: "2%", width: "95%", justifyContent: "center", },
    carouselItemName: { fontSize: 20, fontFamily: GlobalStyles.fontBold, color: GlobalStyles.darkGrey, marginBottom: 8 },
    carouselItemDescription: { fontSize: 16, color: GlobalStyles.grey, marginBottom: 8 },
    carouselItemContact: { fontSize: 14, color: GlobalStyles.blue, marginBottom: 30 },
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