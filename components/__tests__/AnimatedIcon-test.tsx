import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AnimatedIcon from '../AnimatedIcon';
import { Linking, Platform } from 'react-native';

jest.mock('react-native-vector-icons/FontAwesome6', () => 'Icon');

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native/jest/mockComponent');
  
  RN.Linking = {
    openURL: jest.fn(),
  };
  
  RN.Platform = {
    OS: 'ios',
    select: jest.fn(obj => obj.ios),
  };
  
  const createAnimatedValue = (initialValue: number) => {
    const value = {
      current: initialValue,
      interpolate: jest.fn(() => '0deg'),
      setValue: jest.fn(),
      setOffset: jest.fn(),
      flattenOffset: jest.fn(),
      extractOffset: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      removeAllListeners: jest.fn(),
      stopAnimation: jest.fn(),
    };
    return value;
  };
  
  RN.Animated = {
    Value: jest.fn((initialValue) => createAnimatedValue(initialValue)),
    parallel: jest.fn(() => ({
      start: jest.fn(),
    })),
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
    spring: jest.fn(() => ({
      start: jest.fn(),
    })),
    View: 'Animated.View',
  };
  
  RN.StyleSheet = {
    create: (styles: any) => styles,
  };
  
  RN.Pressable = 'Pressable';
  
  RN.TouchableOpacity = 'TouchableOpacity';
  
  return RN;
});

describe('AnimatedIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { UNSAFE_getByType } = render(
      <AnimatedIcon name="facebook" url="https://facebook.com" />
    );
    
    expect(UNSAFE_getByType).toBeDefined();
  });

  it('renders correctly with custom size and color', () => {
    const { UNSAFE_getByType } = render(
      <AnimatedIcon 
        name="twitter" 
        url="https://twitter.com" 
        size={30} 
        color="blue" 
      />
    );
    
    expect(UNSAFE_getByType).toBeDefined();
  });

  it('opens URL when pressed on mobile platforms', () => {
    (Platform.OS as any) = 'ios';
    
    const { UNSAFE_getByType } = render(
      <AnimatedIcon name="instagram" url="https://instagram.com" />
    );
    
    const touchableOpacity = UNSAFE_getByType('TouchableOpacity');
    
    fireEvent.press(touchableOpacity);
    
    expect(Linking.openURL).toHaveBeenCalledWith('https://instagram.com');
  });

  it('opens URL when pressed on web platform', () => {
    (Platform.OS as any) = 'web';
    
    const { UNSAFE_getByType } = render(
      <AnimatedIcon name="linkedin" url="https://linkedin.com" />
    );
    
    const pressable = UNSAFE_getByType('Pressable');
    
    fireEvent.press(pressable);
    
    expect(Linking.openURL).toHaveBeenCalledWith('https://linkedin.com');
  });

  it('handles hover events on web platform', () => {
    (Platform.OS as any) = 'web';
    
    const mockStart = jest.fn();
    const mockParallel = jest.fn().mockReturnValue({ start: mockStart });
    const mockTiming = jest.fn().mockReturnValue({ start: jest.fn() });
    const mockSpring = jest.fn().mockReturnValue({ start: jest.fn() });
    
    const { Animated } = require('react-native');
    Animated.parallel = mockParallel;
    Animated.timing = mockTiming;
    Animated.spring = mockSpring;
    
    const { UNSAFE_getByType } = render(
      <AnimatedIcon name="github" url="https://github.com" />
    );
    
    const pressable = UNSAFE_getByType('Pressable');
    
    fireEvent(pressable, 'hoverIn');
    
    expect(mockParallel).toHaveBeenCalled();
    
    fireEvent(pressable, 'hoverOut');
    
    expect(mockParallel).toHaveBeenCalledTimes(2);
  });
}); 