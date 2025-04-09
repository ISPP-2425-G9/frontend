import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('@/hooks/useResponsiveLayout', () => ({
  __esModule: true,
  default: () => ({
    isMobile: false,
  }),
}));

const MockAnimatedIcon = ({ name, url, size }: { name: string; url: string; size: number }) => (
  <View testID={`icon-${name}`}>
    <Text>{`${name} - ${url} - ${size}`}</Text>
  </View>
);

jest.mock('../AnimatedIcon', () => ({
  __esModule: true,
  default: (props: any) => MockAnimatedIcon(props),
}));

const MockCustomButton = ({ title, onPress, color, style }: { title: string; onPress: () => void; color: string; style: any }) => (
  <TouchableOpacity testID={`button-${title}`} onPress={onPress} style={style}>
    <Text>{title}</Text>
  </TouchableOpacity>
);

jest.mock('@/components/CustomButton', () => ({
  __esModule: true,
  default: (props: any) => MockCustomButton(props),
}));

const MockTermsAndConditions = () => (
  <View testID="terms-content">
    <Text>Terms and Conditions Content</Text>
  </View>
);

jest.mock('@/components/TermsAndConditions', () => ({
  __esModule: true,
  default: () => MockTermsAndConditions(),
}));

import Footer from '../Footer';

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all social media icons', () => {
    const { getByTestId } = render(<Footer />);
    
    expect(getByTestId('icon-instagram')).toBeTruthy();
    expect(getByTestId('icon-linkedin')).toBeTruthy();
    expect(getByTestId('icon-x-twitter')).toBeTruthy();
    expect(getByTestId('icon-tiktok')).toBeTruthy();
    expect(getByTestId('icon-github')).toBeTruthy();
  });

  it('opens terms and conditions modal when clicking the link', () => {
    const { getByText, getByTestId } = render(<Footer />);
    
    const termsLink = getByText('Términos y condiciones');
    fireEvent.press(termsLink);
    
    expect(getByText('Términos y condiciones de uso')).toBeTruthy();
  });

  it('closes terms and conditions modal when clicking close button', () => {
    const { getByText, queryByText } = render(<Footer />);
    
    const termsLink = getByText('Términos y condiciones');
    fireEvent.press(termsLink);
    
    const closeButton = getByText('Cerrar');
    fireEvent.press(closeButton);
    
    expect(queryByText('Términos y condiciones de uso')).toBeNull();
  });

  it('navigates to contact page when clicking contact link', () => {
    const { getByText } = render(<Footer />);
    
    const contactLink = getByText('Contáctanos');
    fireEvent.press(contactLink);
    
    expect(mockNavigate).toHaveBeenCalledWith('contact/index');
  });

  it('displays copyright text', () => {
    const { getByText } = render(<Footer />);
    
    expect(getByText('© 2025 CARONTE. Todos los derechos reservados.')).toBeTruthy();
  });

  it('renders correctly in mobile view', () => {
    jest.spyOn(require('@/hooks/useResponsiveLayout'), 'default').mockImplementation(() => ({
      isMobile: true,
    }));

    const { getByTestId } = render(<Footer />);
    
    const instagramIcon = getByTestId('icon-instagram');
    expect(instagramIcon).toBeTruthy();
    const iconText = instagramIcon.findByType(Text).props.children;
    expect(iconText).toContain('16'); // size para móvil
  });

  it('renders correctly in desktop view', () => {
    jest.spyOn(require('@/hooks/useResponsiveLayout'), 'default').mockImplementation(() => ({
      isMobile: false,
    }));

    const { getByTestId } = render(<Footer />);
    
    const instagramIcon = getByTestId('icon-instagram');
    expect(instagramIcon).toBeTruthy();
    const iconText = instagramIcon.findByType(Text).props.children;
    expect(iconText).toContain('20'); // size para escritorio
  });
}); 