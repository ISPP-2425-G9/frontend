import React from 'react';
import { render } from '@testing-library/react-native';
import CustomPicker from '../CustomPicker';

describe('CustomPicker Component', () => {
  const items = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ];

  it('renders correctly without placeholder', () => {
    const { getByTestId } = render(
      <CustomPicker 
        selectedValue="option1" 
        onValueChange={() => {}} 
        items={items} 
      />
    );
    expect(getByTestId('custom-picker')).toBeTruthy();
  });

  it('renders correctly with placeholder', () => {
    const placeholder = "Select an option";
    const { getByTestId } = render(
      <CustomPicker 
        selectedValue="option1" 
        onValueChange={() => {}} 
        items={items}
        placeholder={placeholder}
        style={{ backgroundColor: 'white' }}
      />
    );
    expect(getByTestId('custom-picker')).toBeTruthy();
  });
});
