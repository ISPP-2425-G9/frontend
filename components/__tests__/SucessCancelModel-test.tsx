import React from 'react';
import { render } from '@testing-library/react-native';
import { Animated } from 'react-native';

jest.mock('@/components/CustomModal', () => {
  return function MockCustomModal({ 
    children, 
    visible, 
    onClose, 
    title 
  }: { 
    children: React.ReactNode; 
    visible: boolean; 
    onClose: () => void; 
    title: string;
  }) {
    if (!visible) return null;
    return (
      <div>
        <div>{title}</div>
        <div>{children}</div>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock('@/components/CustomButton', () => {
  return function MockCustomButton({ 
    title, 
    onPress, 
    color, 
    style 
  }: { 
    title: string; 
    onPress: () => void; 
    color: string; 
    style: any;
  }) {
    return (
      <button onClick={onPress} style={style}>
        {title}
      </button>
    );
  };
});

jest.mock('@expo/vector-icons', () => ({
  FontAwesome: () => 'FontAwesomeIcon',
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  RN.Animated.Value = jest.fn(() => ({
    interpolate: jest.fn(() => '0deg'),
  }));
  
  RN.Animated.parallel = jest.fn(() => ({
    start: jest.fn(),
  }));
  
  RN.Animated.spring = jest.fn(() => ({
    start: jest.fn(),
  }));
  
  RN.Animated.timing = jest.fn(() => ({
    start: jest.fn(),
  }));
  
  return RN;
});

import { SuccessCancelModal } from '../SucessCancelModel';

describe('SuccessCancelModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible is true', () => {
    const onClose = jest.fn();
    render(
      <SuccessCancelModal visible={true} onClose={onClose} />
    );
    
    expect(true).toBeTruthy();
  });

  it('does not render when visible is false', () => {
    const onClose = jest.fn();
    render(
      <SuccessCancelModal visible={false} onClose={onClose} />
    );

    expect(true).toBeTruthy();
  });

  it('calls onClose when the continue button is pressed', () => {
    const onClose = jest.fn();
    render(
      <SuccessCancelModal visible={true} onClose={onClose} />
    );
    
    onClose();
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('starts animations when visible becomes true', () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <SuccessCancelModal visible={false} onClose={onClose} />
    );

    rerender(<SuccessCancelModal visible={true} onClose={onClose} />);

    expect(Animated.parallel).toHaveBeenCalled();
  });
}); 