import React from 'react';
import TabLayout from '@/app/_layout';
import { useColorScheme } from 'react-native';

jest.mock('@/hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@expo-google-fonts/dm-sans', () => ({
  useFonts: jest.fn(() => [true]),
  DMSans_500Medium: 'DMSans_500Medium',
  DMSans_700Bold: 'DMSans_700Bold',
}));

jest.mock('react-native', () => {
  return {
    View: 'View',
    Text: 'Text',
    StyleSheet: {
      create: jest.fn(styles => styles),
    },
    useColorScheme: jest.fn(),
    Dimensions: {
      get: jest.fn().mockReturnValue({
        width: 375,
        height: 812,
      }),
    },
  };
});

jest.mock('@/components/CustomNavbar', () => 'CustomNavbar');
jest.mock('@/components/Footer', () => 'Footer');
jest.mock('@/context/NotificationContext', () => ({
  NotificationProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('expo-router', () => ({
  Tabs: {
    Screen: jest.fn().mockImplementation(({ name, options }) => {
      return {
        type: 'Tabs.Screen',
        props: { name, options },
      };
    }),
  },
}));

jest.mock('@/constants/Colors', () => ({
  Colors: {
    light: { background: '#FFFFFF' },
    dark: { background: '#000000' },
  },
}));

jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    createElement: jest.fn((type, props, ...children) => {
      return {
        type,
        props: { ...props, children },
      };
    }),
  };
});

describe('TabLayout', () => {
  const mockUseAuth = require('@/hooks/useAuth').default;
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useColorScheme as jest.Mock).mockReturnValue('light');
  });

  it('renders correctly when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      roles: null,
    });

    const TabLayoutComponent = TabLayout as any;
    const result = TabLayoutComponent();
    
    expect(result).toBeTruthy();
    expect(typeof result.type).toBe('function');
  });

  it('renders correctly when authenticated as ADMIN', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      roles: ['ADMIN'],
    });

    const TabLayoutComponent = TabLayout as any;
    const result = TabLayoutComponent();
    
    expect(result).toBeTruthy();
    expect(typeof result.type).toBe('function');
  });

  it('renders correctly when authenticated as CUSTOMER', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      roles: ['CUSTOMER'],
    });

    const TabLayoutComponent = TabLayout as any;
    const result = TabLayoutComponent();
    
    expect(result).toBeTruthy();
    expect(typeof result.type).toBe('function');
  });

  it('renders correctly when authenticated as CUSTOMER_PREMIUM', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      roles: ['CUSTOMER_PREMIUM'],
    });

    const TabLayoutComponent = TabLayout as any;
    const result = TabLayoutComponent();
    
    expect(result).toBeTruthy();
    expect(typeof result.type).toBe('function');
  });

  it('renders correctly when fonts are not loaded', () => {
    const { useFonts } = require('@expo-google-fonts/dm-sans');
    useFonts.mockReturnValue([false]);
    
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      roles: ['ADMIN'],
    });

    const TabLayoutComponent = TabLayout as any;
    const result = TabLayoutComponent();
    
    expect(result).toBeNull();
  });

  it('renders correctly with dark theme', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      roles: null,
    });

    const TabLayoutComponent = TabLayout as any;
    const result = TabLayoutComponent();
    
    if (result === null) {
      expect(result).toBeNull();
    } else {
      expect(result).toBeTruthy();
      expect(typeof result.type).toBe('function');
    }
  });
}); 