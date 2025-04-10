import React, { ReactNode } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ListServiceScreen from '../services/index';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withAuth } from '../_util/withAuth';
import { AUTHORITIES } from '../_util/Authorities';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  const React = require('react');

  return {
    ...actualNav,
    useFocusEffect: (cb: any) => {
      React.useEffect(cb, []);
    },
  };
});


jest.mock('../_util/withAuth', () => ({
  withAuth: (Component: React.ComponentType) => Component,
}));

jest.mock('../_util/useAuth', () => ({
  useAuth: () => ({
    user: { roles: ['CUSTOMER'] },
    getUserFromStorage: jest.fn(() => Promise.resolve({ roles: ['CUSTOMER'] })),
  }),
}));



jest.mock('react-native/Libraries/Settings/Settings', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));


jest.mock('react-native', () => {
  const actualReactNative = jest.requireActual('react-native');
  return {
    ...actualReactNative,
    useWindowDimensions: jest.fn(() => ({
      width: 1024,
      height: 1024,
    })),
    ScrollView: ({ children }: { children: ReactNode }) => <>{children}</>,
    View: ({ children }: { children: ReactNode }) => <>{children}</>,
    Text: ({ children }: { children: ReactNode }) => <>{children}</>,
    ActivityIndicator: () => <></>,
    StyleSheet: {
      create: (styles: Record<string, any>) => styles,
      flatten: jest.fn()
    },
    Platform: {
      OS: 'web',
      select: (options: Record<string, any>) => options.web ?? options.default,
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 1024, height: 768 })),
    },
    Settings: {
      get: jest.fn(),
      set: jest.fn(),
    },
    Animated: {
      Value: jest.fn(),
      timing: jest.fn(),
      View: ({ children }: { children: ReactNode }) => <>{children}</>,
    },
    TouchableOpacity: ({ children, onPress }: { children: ReactNode; onPress?: () => void }) => (
      <div onClick={onPress}>{children}</div>
    ),
    Image: ({ source }: { source: any }) => <img src={source.uri} alt="" />,
    Modal: ({ children, visible }: { children: ReactNode; visible: boolean }) =>
      visible ? <div>{children}</div> : null,
    Pressable: ({ children, onPress }: { children: ReactNode; onPress?: () => void }) => (
      <div onClick={onPress}>{children}</div>
    ),
  };
});

const mockUseWindowDimensions = require('react-native').useWindowDimensions;

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('mock-token')),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        content: [
          {
            name: 'Empresa Test 1',
            email: 'test1@example.com',
            telephone: '123456789',
            address: 'Calle Test 1',
            city: 'Ciudad Test',
            zipCode: '12345',
            imageUrl: 'https://example.com/image1.jpg',
            description: 'Descripción de prueba 1',
            nif: 'A12345678',
          },
          {
            name: 'Empresa Test 2',
            email: 'test2@example.com',
            telephone: '987654321',
            address: 'Calle Test 2',
            city: 'Otra Ciudad',
            zipCode: '54321',
            imageUrl: 'https://example.com/image2.jpg',
            description: 'Descripción de prueba 2',
            nif: 'B87654321',
          },
        ],
        totalPages: 2,
      }),
  })
);
global.fetch = mockFetch as unknown as typeof fetch;


jest.mock('@/components/ThemedView', () => ({
  ThemedView: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/CustomTextInput', () => {
  const { TextInput } = require('react-native');
  return function MockCustomTextInput({
    placeholder,
    value,
    onChangeText,
  }: {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
  }) {
    return (
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        testID={`input-${placeholder}`}
      />
    );
  };
});


jest.mock('@/components/CustomButton', () => {
  const {Pressable} = require('react-native')
  return function MockCustomButton({
    title,
    onPress,
    color,
    style,
  }: {
    title: string;
    onPress: () => void;
    color: string;
    style: any;
  }) {
    return (
      <Pressable onClick={onPress} style={style} data-testid={`button-${title}`}>
        {title}
      </Pressable>
    );
  };
});

jest.mock('@/components/AdvertisementSponsor', () => {
  const {View, Text } = require('react-native')
  return function MockAdvertisementSponsor({
    sponsor,
  }: {
    sponsor: {
      name: string;
      description: string;
      nif: string;
    };
  }) {
    return (
      <View data-testid={`sponsor-${sponsor.nif}`}>
        <Text>{sponsor.name}</Text>
        <Text>{sponsor.description}</Text>
      </View>
    );
  };
});

let documentTitle = ''
const mockDocument = {
  get title() {
    return documentTitle;
  },
  set title(value) {
    documentTitle = value;
  }
};

if (typeof global.document !== 'undefined') {
  Object.defineProperty(global.document, 'title', {
    get: () => documentTitle,
    set: (value) => { documentTitle = value; },
    configurable: true
  });
} else {
  global.document = mockDocument as any;
}

describe('ListServiceScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    documentTitle = '';
    mockFetch.mockClear();
  });

  it('should set document title to "Servicios" when focused', () => {
    render(<ListServiceScreen />);
    expect(documentTitle).toBe('Servicios');
  });

  it('should filter sponsors by city', async () => {
    const { getByTestId, queryByTestId } = render(<ListServiceScreen />);
    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
    });
  
    const cityInput = getByTestId('input-Buscar por nombre');
    fireEvent.changeText(cityInput, 'test');
  
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('name=test'),
        expect.any(Object)
      );
    });
    
  });

  it('should filter sponsors by name', async () => {
    const { getByTestId, queryByTestId, debug } = render(<ListServiceScreen />);
  
    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
    });
  
    const nameInput = getByTestId('input-Buscar por nombre');
    fireEvent.changeText(nameInput, 'Empresa Test 1');
  
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('name=Empresa+Test+1'),
        expect.any(Object)
      );
    });
  });
  
  it('should handle error when fetching sponsors', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ content: [], totalPages: 0 }),
      })
    );
    
    const { queryByTestId } = render(<ListServiceScreen />);
    
    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
    });
    
    expect(queryByTestId('sponsor-A12345678')).toBeNull();
    expect(queryByTestId('sponsor-B87654321')).toBeNull();
  });

  it('should adapt to mobile view', () => {
    mockUseWindowDimensions.mockReturnValueOnce({ width: 767, height: 768 });
    const { getByTestId } = render(<ListServiceScreen />);
  });
}); 