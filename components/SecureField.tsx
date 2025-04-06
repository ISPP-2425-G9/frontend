import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, StyleProp } from 'react-native';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { FontAwesome } from '@expo/vector-icons';
import useResponsiveLayout from '@/hooks/useResponsiveLayout';

interface CustomViewStyle {
    flex?: number;
    width?: number | `${number}%` | 'auto';
    marginBottom?: number;
    [key: string]: unknown;
}

interface SecureFieldProps {
    label: string;
    element: typeof CardNumberElement | typeof CardExpiryElement | typeof CardCvcElement;
    style?: StyleProp<CustomViewStyle>;
    isCardNumber?: boolean;
}

interface CardChangeEvent {
    brand?: string;
    complete?: boolean;
    value?: string;
}


const SecureField: React.FC<SecureFieldProps> = ({
    label,
    element: Element,
    style,
    isCardNumber = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [cardBrand, setCardBrand] = useState<string>('');
    const [isComplete, setIsComplete] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(1))[0];
    const {isMobile} = useResponsiveLayout();

    const cardElementStyle = {
        style: {
            base: {
                fontSize: isMobile ? '14px' : '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                iconColor: '#666EE8',
            },
            invalid: {
                color: '#9e2146',
            },
            complete: {
                color: 'inherit',
            },
        },
    };

    useEffect(() => {
        if (isFocused) {
            Animated.spring(scaleAnim, {
                toValue: 1.02,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        }
    }, [isFocused]);

    const handleCardChange = (event: CardChangeEvent) => {
        if (isCardNumber && event.brand) {
            setCardBrand(event.brand);
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
        setIsComplete(event.complete ?? false);
    };

    type FontAwesomeIconNames =
        | 'cc-visa'
        | 'cc-mastercard'
        | 'cc-amex'
        | 'cc-discover'
        | 'cc-diners-club'
        | 'cc-jcb'
        | 'credit-card';

    const getCardIcon = () => {

        const cardIcons: { [key: string]: FontAwesomeIconNames } = {
            visa: 'cc-visa',
            mastercard: 'cc-mastercard',
            amex: 'cc-amex',
            discover: 'cc-discover',
            diners: 'cc-diners-club',
            jcb: 'cc-jcb',
        };
        return cardIcons[cardBrand.toLowerCase()] || 'credit-card';
    };

    return (
        <Animated.View style={[styles.secureFieldContainer, style, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.labelRow}>
                <View style={styles.labelContainer}>
                    <Text style={styles.cardLabel}>{label}</Text>
                    {isCardNumber && cardBrand && (
                        <Animated.View style={[styles.cardBrandContainer, { opacity: fadeAnim }]}>
                            <FontAwesome
                                name={getCardIcon()}
                                size={20}
                                color="#666EE8"
                                style={styles.cardBrandIcon}
                            />
                        </Animated.View>
                    )}
                </View>
            </View>
            <View style={[
                styles.inputContainer,
                isFocused && styles.inputContainerFocused,
                isComplete && styles.inputContainerComplete
            ]}>
                <Element
                    options={{
                        ...cardElementStyle,
                        style: {
                            ...cardElementStyle.style,
                            base: {
                                ...cardElementStyle.style.base,
                                color: '#424770',
                            },
                            complete: {
                                color: '#43a047',
                            }
                        }
                    }}
                    onChange={handleCardChange}
                    onFocus={() => { setIsFocused(true); }}
                    onBlur={() => { setIsFocused(false); }}
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({

    secureFieldContainer: {
        marginBottom: 15,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cardLabel: {
        fontSize: 12,
        color: '#424770',
        fontWeight: '500',
    },
    inputContainer: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    inputContainerFocused: {
        borderColor: '#80bdff',
        shadowColor: 'rgba(0,123,255,0.25)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputContainerComplete: {
        borderColor: '#43a047',
        backgroundColor: '#f8f9fa',
    },
    cardBrandContainer: {
        marginLeft: 8,
    },
    cardBrandIcon: {
        marginTop: 2,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
});

export default SecureField;