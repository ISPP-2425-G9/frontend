import React, { useRef } from "react";
import { Animated, TouchableOpacity, Linking, StyleSheet, Platform, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

interface AnimatedIconProps {
  name: string;
  url: string;
  size?: number;
  color?: string;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ name, url, size = 20, color = "white" }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const handleHoverIn = () => {
    Animated.parallel([
      Animated.timing(rotate, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1.2,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleHoverOut = () => {
    Animated.parallel([
      Animated.timing(rotate, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const animatedStyle = {
    transform: [{ scale }, { rotate: rotateInterpolate }],
  };

  if (Platform.OS === "web") {
    return (
      <Pressable
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onPress={() => Linking.openURL(url)}
        style={styles.iconWrapper}
      >
        <Animated.View style={animatedStyle}>
          <Icon name={name} size={size} color={color} />
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(url)}
      activeOpacity={0.8}
      style={styles.iconWrapper}
    >
      <Icon name={name} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    marginHorizontal: 10,
  },
});

export default AnimatedIcon;
