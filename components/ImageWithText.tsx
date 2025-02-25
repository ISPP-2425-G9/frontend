import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type ImageWithTextProps = {
  image: ImageSourcePropType | string; 
  text: string;
  style?: ViewStyle;
  onPress?: () => void; 
  redirectTo?: string; 
};

const ImageWithText: React.FC<ImageWithTextProps> = ({ image, text, style, onPress, redirectTo }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (redirectTo) {
      navigation.navigate(redirectTo as never);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <Pressable style={[styles.container, style]} onPress={handlePress} disabled={!onPress && !redirectTo}>
      <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.image} resizeMode="contain" />
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#434343',
  },
});

export default ImageWithText;
