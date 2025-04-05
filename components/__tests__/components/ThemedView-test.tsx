import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedView } from '../../ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn(),
}));

describe('ThemedView Component', () => {
  it('applies the correct theme color', () => {
    useThemeColor.mockReturnValue('blue');
    const { getByTestId } = render(<ThemedView testID="themed-view" />);
    const view = getByTestId('themed-view');

    expect(view.props.style).toEqual([{ backgroundColor: 'blue' }, undefined]);
  });

  it('applies custom styles correctly', () => {
    useThemeColor.mockReturnValue('red');
    const { getByTestId } = render(
      <ThemedView testID="themed-view" style={{ padding: 10 }} />
    );
    const view = getByTestId('themed-view');

    expect(view.props.style).toEqual([{ backgroundColor: 'red' }, { padding: 10 }]);
  });
});