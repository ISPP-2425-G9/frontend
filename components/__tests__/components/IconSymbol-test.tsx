import React from 'react';
import { render } from '@testing-library/react-native';
import { IconSymbol } from '../../ui/IconSymbol';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

describe('IconSymbol Component', () => {
  it('renders correctly with given props', () => {
    const { getByTestId } = render(
      <IconSymbol name="house.fill" size={32} color="blue" />
    );

    const icon = getByTestId('icon-symbol');
    expect(icon).toBeTruthy();
  });
});