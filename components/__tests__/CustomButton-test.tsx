import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../CustomButton';
import { GlobalStyles } from '@/constants/Colors';

describe('CustomButton Component', () => {
  it('renders correctly with given title', () => {
    const { getByText } = render(<CustomButton title="Click Me" onPress={() => {}} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<CustomButton title="Press" onPress={mockOnPress} />);
    
    fireEvent.press(getByText('Press'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies correct color styles', () => {
    const { getByTestId } = render(
      <CustomButton title="Blue Button" onPress={() => {}} color="blue" />
    );
    
    expect(getByTestId('custom-button').props.style).toEqual(
      expect.arrayContaining([{ backgroundColor: GlobalStyles.blue }])
    );
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <CustomButton title="Disabled" onPress={mockOnPress} disabled />
    );
    
    fireEvent.press(getByText('Disabled'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('applies grey text color when button color is white', () => {
    const { getByText } = render(
      <CustomButton title="White Button" onPress={() => {}} color="white" />
    );
    
    const buttonText = getByText('White Button');
    expect(buttonText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: GlobalStyles.darkGrey })
      ])
    );
  });

  it('applies white text color when button color is not white', () => {
    const { getByText } = render(
      <CustomButton title="Blue Button" onPress={() => {}} color="blue" />
    );
    
    const buttonText = getByText('Blue Button');
    expect(buttonText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: GlobalStyles.white })
      ])
    );
  });
});