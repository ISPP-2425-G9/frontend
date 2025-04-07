import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NotificationProvider } from '@/context/NotificationContext'; // Ajusta el import según tu estructura
import Contact from '@/app/contact';

jest.mock('expo-font', () => ({
  isLoaded: true,
  useFonts: () => [true],
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: jest.fn(),
  useNavigation: jest.fn().mockReturnValue({ navigate: jest.fn() }),
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

jest.mock('react-native-vector-icons/FontAwesome6', () => {
  return {
    __esModule: true,
    default: 'FontAwesome6',
  };
});

describe('Contact Screen', () => {

  const renderWithNavigation = (component) => {
    return render(
      <NavigationContainer>
        <NotificationProvider>
          {component}
        </NotificationProvider>
      </NavigationContainer>
    );
  };

  it('renders without crashing', () => {
    const { getByText } = renderWithNavigation(<Contact />);
    expect(getByText('Contáctanos')).toBeTruthy();
  });
});
