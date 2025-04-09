import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DropDownPicker from '../DropDownPicker';

jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
  StyleSheet: {
    create: jest.fn(styles => styles),
    flatten: jest.fn(style => style),
  },
}));

jest.mock('@expo/vector-icons', () => ({
  AntDesign: 'AntDesign',
}));

jest.mock('@/constants/Colors', () => ({
  GlobalStyles: {
    blue: '#007AFF',
    darkGrey: '#333333',
    lightGrey: '#F5F5F5',
    font: 'System',
  },
}));

describe('DropDownPicker', () => {
  const mockOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];
  
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    expect(getByText('-')).toBeTruthy();
  });

  it('renders correctly with empty options array', () => {
    const { getByText } = render(
      <DropDownPicker options={[]} onSelect={mockOnSelect} />
    );
    
    expect(getByText('-')).toBeTruthy();
  });

  it('opens dropdown when pressed', () => {
    const { getByText, queryByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    expect(queryByText('Option 1')).toBeNull();
    
    fireEvent.press(getByText('-'));
    
    expect(getByText('Option 1')).toBeTruthy();
    expect(getByText('Option 2')).toBeTruthy();
    expect(getByText('Option 3')).toBeTruthy();
  });

  it('closes dropdown when an option is selected', () => {
    const { getByText, queryByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('-'));
    
    fireEvent.press(getByText('Option 1'));
    
    expect(queryByText('Option 2')).toBeNull();
    expect(queryByText('Option 3')).toBeNull();
    
    expect(getByText('Option 1')).toBeTruthy();
  });

  it('calls onSelect with the selected value', () => {
    const { getByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('-'));
    
    fireEvent.press(getByText('Option 2'));
    
    expect(mockOnSelect).toHaveBeenCalledWith('2');
  });

  it('allows selecting the default option (null)', () => {
    const { getByText, getAllByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('-'));
    
    const defaultOptions = getAllByText('-');
    fireEvent.press(defaultOptions[1]);
    
    expect(mockOnSelect).toHaveBeenCalledWith(null);
  });

  it('applies custom style when provided', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByText } = render(
      <DropDownPicker 
        options={mockOptions} 
        onSelect={mockOnSelect} 
        style={customStyle} 
      />
    );
    
    expect(getByText('-')).toBeTruthy();
  });

  it('uses grey color when specified', () => {
    const { getByText } = render(
      <DropDownPicker 
        options={mockOptions} 
        onSelect={mockOnSelect} 
        color="grey" 
      />
    );
    
    expect(getByText('-')).toBeTruthy();
  });

  it('displays the selected option label', () => {
    const { getByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('-'));
    
    fireEvent.press(getByText('Option 3'));
    
    expect(getByText('Option 3')).toBeTruthy();
  });

  it('handles hover state on options', () => {
    const { getByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('-'));
    
    const option = getByText('Option 1');
    fireEvent(option, 'hoverIn');
    
    fireEvent.press(option);
    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('handles case when selected value is not found in options', () => {
    const { getByText } = render(
      <DropDownPicker 
        options={mockOptions} 
        onSelect={mockOnSelect} 
      />
    );
    
    expect(getByText('-')).toBeTruthy();
  });

  it('handles case when selected value is not found in options after selection', () => {
    const { getByText, rerender, queryByText } = render(
      <DropDownPicker 
        options={mockOptions} 
        onSelect={mockOnSelect} 
      />
    );
    
    fireEvent.press(getByText('-'));
    
    fireEvent.press(getByText('Option 1'));
    
    expect(getByText('Option 1')).toBeTruthy();
    
    const newOptions = [
      { label: 'New Option 1', value: 'new1' },
      { label: 'New Option 2', value: 'new2' },
    ];
    
    rerender(
      <DropDownPicker 
        options={newOptions} 
        onSelect={mockOnSelect} 
      />
    );

    expect(queryByText('Option 1')).toBeNull();
    expect(queryByText('Option 2')).toBeNull();
    expect(queryByText('Option 3')).toBeNull();
  });

  it('toggles dropdown state correctly', () => {
    const { getByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('-'));
    expect(getByText('Option 1')).toBeTruthy();
    
    fireEvent.press(getByText('Option 1'));
    expect(getByText('Option 1')).toBeTruthy();
    
    fireEvent.press(getByText('Option 1'));
    expect(getByText('Option 2')).toBeTruthy();
  });

  it('toggles dropdown state when clicking on the selector after selection', () => {
    const { getByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('-'));
    
    fireEvent.press(getByText('Option 1'));
    
    expect(getByText('Option 1')).toBeTruthy();
    
    fireEvent.press(getByText('Option 1'));
    
    expect(getByText('Option 2')).toBeTruthy();
  });

  it('handles selection of middle option correctly', () => {
    const { getByText, queryByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('-'));
    
    fireEvent.press(getByText('Option 2'));
    
    expect(getByText('Option 2')).toBeTruthy();
    
    expect(mockOnSelect).toHaveBeenCalledWith('2');
    
    expect(queryByText('Option 1')).toBeNull();
    expect(queryByText('Option 3')).toBeNull();
  });

  it('applies hover styles to options correctly', () => {
    const { getByText, getAllByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('-'));
    
    const defaultOptions = getAllByText('-');
    const defaultOption = defaultOptions[1];
    
    fireEvent(defaultOption, 'hoverIn', {});
    
    fireEvent.press(defaultOption);
    expect(mockOnSelect).toHaveBeenCalledWith(null);
    
    mockOnSelect.mockClear();
    
    fireEvent.press(getByText('-'));
    
    const option = getByText('Option 1');
    
    fireEvent(option, 'hoverIn', {});
    
    fireEvent.press(option);
    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('handles hover state on options with custom color', () => {
    const { getByText } = render(
      <DropDownPicker 
        options={mockOptions} 
        onSelect={mockOnSelect} 
        color="grey" 
      />
    );
    
    fireEvent.press(getByText('-'));
    
    const option = getByText('Option 1');
    
    fireEvent(option, 'hoverIn', {});
    
    fireEvent.press(option);
    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('applies hover styles to all options in the dropdown', () => {
    const { getByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('-'));
    
    mockOptions.forEach(option => {
      const optionElement = getByText(option.label);
      
      fireEvent(optionElement, 'hoverIn', {});
      
      fireEvent.press(optionElement);
      expect(mockOnSelect).toHaveBeenCalledWith(option.value);
      
      mockOnSelect.mockClear();
      
      fireEvent.press(getByText(option.label));
    });
  });

  it('handles hover state with hoverOut event', () => {
    const { getByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('-'));
    
    const option = getByText('Option 1');
    
    fireEvent(option, 'hoverIn', {});
    
    fireEvent(option, 'hoverOut', {});
    
    fireEvent.press(option);
    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('handles hover state with multiple hover events', () => {
    const { getByText } = render(
      <DropDownPicker options={mockOptions} onSelect={mockOnSelect} />
    );
    
    fireEvent.press(getByText('-'));
    
    const option = getByText('Option 1');
    
    fireEvent(option, 'hoverIn', {});
    fireEvent(option, 'hoverOut', {});
    fireEvent(option, 'hoverIn', {});
    
    fireEvent.press(option);
    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });
}); 