import { ThemedText } from "@/components/ThemedText";
import { GlobalStyles } from "@/constants/Colors";
import React from "react";
import { Animated, Dimensions, Image, Linking, StyleSheet, TouchableOpacity, View } from "react-native";

const carouselItems = [
    {
        image: "https://upload.wikimedia.org/wikipedia/commons/2/27/Floristeria_a_l%27exterior_del_mercat_de_Russafa.JPG",
        name: "Gardenia Sevilla",
        description: "Floristería boutique con diseños vanguardistas, asesoramiento para bodas y eventos corporativos, y arreglos funerarios exclusivos, coronas de condolencia y detalles florales para cementerios.",
        address: "Plaza del Salvador, 4, Sevilla, 41004",
        mail: "contacto@gardeniasevilla.es",
        phone: "954 123 789",
    },
    {
        image: "https://residencialeonxiii.es/wp-content/uploads/2023/09/OPOSICIONES-NOTARIA.png",
        name: "Notaría García & Asociados",
        description: "Despacho especializado en escrituras públicas de compraventa, testamentos y herencias. También gestionamos autorizaciones y formalidades para autorizaciones de enterramiento en cementerios.",
        address: "Carrer de Balmes, 102, Barcelona, 08008",
        mail: "info@notariagarcia.es",
        phone: "934 567 210",
    },
    {
        image: "https://upload.wikimedia.org/wikipedia/commons/5/54/Finalizan_las_obras_de_rehabilitaci%C3%B3n_del_Tanatorio_Sur_06.jpg",
        name: "Tanatorio Costa Azul",
        description: "Especialistas en homenajes personalizados frente al mar, servicio de cremación y traslado de cenizas, gestión de concesiones de panteones y atención 24h para trámites en cementerios.",
        address: "Passeig Marítim, 108, Barcelona, 08003",
        mail: "info@tanatoriocostaazul.com",
        phone: "932 765 432",
    },
];

const SponsorCarousel: React.FC = () => {
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
                    <ThemedText style={[styles.carouselItemDescription, width > 700 ? { height: 70 } : { height: 140 }]}>
                        {carouselItems[currentIndex].description}
                    </ThemedText>
                    <ThemedText style={styles.carouselItemAddress}>
                        {carouselItems[currentIndex].address}
                    </ThemedText>

                    <TouchableOpacity
                        onPress={() =>
                            Linking.openURL(`mailto:${carouselItems[currentIndex].mail}`)
                        }
                    >
                        <ThemedText style={styles.carouselItemMail}>
                            {carouselItems[currentIndex].mail}
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            Linking.openURL(`tel:${carouselItems[currentIndex].phone}`)
                        }
                    >
                        <ThemedText style={styles.carouselItemsPhone}>
                            {carouselItems[currentIndex].phone}
                        </ThemedText>
                    </TouchableOpacity>
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
    carouselContainer: { width: "100%", alignItems: "center", borderColor: GlobalStyles.lightGrey, borderWidth: 1, borderRadius: 25, overflow: "hidden", position: "relative", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 10.84, elevation: 2 },
    carouselItem: {
        width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
        backgroundColor: GlobalStyles.lightGrey,
        borderRadius: 25, overflow: "hidden", height: "100%",
    },
    carouselItemImage: { width: "100%", aspectRatio: 2.22, justifyContent: "flex-start", },
    carouselItemContent: { marginLeft: "2%", marginTop: "2%", width: "95%", justifyContent: "center", marginBottom: 35 },
    carouselItemName: { fontSize: 20, fontFamily: GlobalStyles.fontBold, color: GlobalStyles.darkGrey, marginBottom: 8 },
    carouselItemDescription: { fontSize: 16, color: GlobalStyles.grey, marginBottom: 8 },
    carouselItemAddress: { fontSize: 14, color: GlobalStyles.grey, marginBottom: 0 },
    carouselItemMail: { fontSize: 14, color: GlobalStyles.blue, marginBottom: 0 },
    carouselItemsPhone: { fontSize: 14, color: GlobalStyles.blue, },
    progressBarContainer: {
        position: "absolute", bottom: 10, height: 4, width: "10%",
        backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 2,
    },
    progressBar: { height: "100%", backgroundColor: GlobalStyles.blue, borderRadius: 2 },
    dotsContainer: { position: "absolute", bottom: 20, flexDirection: "row" },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "rgba(0,0,0,0.3)", marginHorizontal: 5 },
    activeDot: { backgroundColor: GlobalStyles.blue },
});

export default SponsorCarousel;