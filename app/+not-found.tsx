import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';
import React from 'react';

export default function NotFoundScreen() {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      navigation.navigate('home' as never);
    }, [navigation])
  );

  return null;
}