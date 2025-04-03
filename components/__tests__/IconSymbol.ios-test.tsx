import React from 'react';
import { render } from '@testing-library/react-native';
import { IconSymbol } from '..//ui/IconSymbol';
import { SymbolView } from 'expo-symbols';

describe('IconSymbol Component', () => {
  it('renders correctly with given props', () => {
    const { getByTestId } = render(
      <IconSymbol name="star" size={32} color="blue" weight="bold" />
    );

    const icon = getByTestId('icon-symbol');
    expect(icon).toBeTruthy();
  });
});
