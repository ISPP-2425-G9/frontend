import { Text, type TextProps, StyleSheet } from 'react-native';
import { GlobalStyles } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultBold' | 'subtitle' ;
};

export function ThemedText({
  style,
  type = 'default',
  ...rest
}: ThemedTextProps) {

  return (
    <Text
      style={[
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultBold' ? styles.defaultBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: GlobalStyles.font,
    fontSize: 16,
    lineHeight: 24,
    color: GlobalStyles.darkGrey,
  },
  defaultBold: {
    fontFamily: GlobalStyles.fontBold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: GlobalStyles.darkGrey,
  },
  title: {
    fontFamily: GlobalStyles.font,
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
    color: GlobalStyles.blue,
  },
  subtitle: {
    fontFamily: GlobalStyles.font,
    fontSize: 20,
    fontWeight: 'bold',
    color: GlobalStyles.grey,
  },
});
