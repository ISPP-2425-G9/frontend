/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { useFonts,  DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { linkTo } from "expo-router/build/global-state/routing";

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const GlobalStyles = {
  darkGrey: '#434343',
  grey: '#5C5C5C',
  lightGrey: '#e3e3e3',
  blue: '#42B5FC',
  white: '#F3F3F3',
  red: '#E53E3E',
  font: 'DMSans_500Medium',
  fontBold: 'DMSans_700Bold',
}