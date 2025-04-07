import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Animated } from 'react-native';
import '@testing-library/jest-native/extend-expect';
import AboutUs, { teamMembers } from '@/app/about';


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
    

describe('AboutUs Screen', () => {
  it('should render the title and subtitle correctly', async () => {
    const { getByText } = render(<AboutUs />);

    await waitFor(() => expect(getByText('Sobre nosotros')).toBeTruthy());
    await waitFor(() => expect(getByText('Conoce al equipo detrás de CARONTE')).toBeTruthy());
  });

  it('should render the intro text correctly', async () => {
    const { getByText } = render(<AboutUs />);

    await waitFor(() => {
      expect(getByText(/CARONTE nace como una solución digital/)).toBeTruthy();
      expect(getByText(/Universidad de Sevilla/)).toBeTruthy();
      expect(getByText(/15 desarrolladores apasionados/)).toBeTruthy();
    });
  });

  it('should render all team members correctly', async () => {
    const { getByText, getByTestId } = render(<AboutUs />);
  
    teamMembers.forEach((member, index) => {
      expect(getByText(member.name)).toBeTruthy();
  
      expect(getByTestId(`role-${index}`)).toHaveTextContent(member.role);
  
      expect(getByTestId(`hobbies-${index}`)).toHaveTextContent(`Aficiones: ${member.hobbies}`);
    });
  });

});
