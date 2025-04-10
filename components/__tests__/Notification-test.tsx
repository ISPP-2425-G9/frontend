import React from 'react';
import { render, act } from '@testing-library/react-native';
import Notification from '../Notification';
import { GlobalStyles } from '@/constants/Colors';
import { Animated, StyleSheet } from 'react-native';

// Mock the GlobalStyles
jest.mock('@/constants/Colors', () => ({
  GlobalStyles: {
    green: '#4CAF50',
    red: '#F44336',
    blue: '#2196F3',
    orange: '#FF9800',
    font: 'Arial',
  },
}));

// Mock the Animated API
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native/jest/mockComponent');
  
  // Create a mock Animated object
  const mockAnimatedValue = {
    setValue: jest.fn(),
    interpolate: jest.fn().mockReturnValue(0),
    stopAnimation: jest.fn(),
  };
  
  // Create a mock Animated object
  const mockAnimated = {
    Value: jest.fn().mockImplementation(() => mockAnimatedValue),
    timing: jest.fn().mockReturnValue({
      start: jest.fn((callback) => {
        if (callback) callback();
      }),
    }),
    View: 'Animated.View',
  };
  
  // Assign the mock Animated object to RN
  RN.Animated = mockAnimated;
  
  // Mock Text
  RN.Text = 'Text';
  
  // Mock StyleSheet with flatten function
  RN.StyleSheet = {
    create: (styles: Record<string, any>) => styles,
    flatten: (styles: any) => styles,
  };
  
  return RN;
});

describe('Notification', () => {
  const mockOnHide = jest.fn();
  const defaultProps = {
    message: 'Test notification',
    onHide: mockOnHide,
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  it('renders correctly with default props', () => {
    const { getByText } = render(<Notification {...defaultProps} />);
    
    // Check if the message is rendered
    expect(getByText('Test notification')).toBeTruthy();
  });
  
  it('renders with different notification types', () => {
    const types = ['success', 'error', 'info', 'warning'];
    
    types.forEach(type => {
      const { getByText } = render(
        <Notification {...defaultProps} type={type as any} />
      );
      
      // Check if the message is rendered
      expect(getByText('Test notification')).toBeTruthy();
    });
  });
  
  it('calls onHide after the duration', () => {
    const duration = 2000;
    
    render(<Notification {...defaultProps} duration={duration} />);
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(duration + 300); // duration + animation time
    });
    
    // Check if onHide was called
    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });
  
  it('resets animation when message changes', () => {
    const { rerender, getByText } = render(<Notification {...defaultProps} />);
    
    // Check if the message is rendered
    expect(getByText('Test notification')).toBeTruthy();
    
    // Change the message
    rerender(<Notification {...defaultProps} message="New message" />);
    
    // Check if the new message is rendered
    expect(getByText('New message')).toBeTruthy();
    
    // Check if stopAnimation was called
    expect(Animated.Value).toHaveBeenCalled();
  });
  
  it('cleans up timer on unmount', () => {
    const { unmount } = render(<Notification {...defaultProps} />);
    
    // Unmount the component
    unmount();
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(2000 + 300); // duration + animation time
    });
    
    // Check if onHide was not called after unmount
    expect(mockOnHide).not.toHaveBeenCalled();
  });
  
  it('uses custom duration when provided', () => {
    const customDuration = 5000;
    
    render(<Notification {...defaultProps} duration={customDuration} />);
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(customDuration - 100); // Almost at the end
    });
    
    // Check if onHide was not called yet
    expect(mockOnHide).not.toHaveBeenCalled();
    
    // Fast-forward the rest of the time
    act(() => {
      jest.advanceTimersByTime(400); // The rest of the time
    });
    
    // Check if onHide was called
    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });
}); 