import React from 'react';
import { render } from '@testing-library/react-native';
import LineBreak from '../LineBreack';

describe('LineBreak', () => {
  it('should render', () => {
    const { getByTestId } = render(<LineBreak />);

    const lineBreak = getByTestId('line-break');
    expect(lineBreak).toBeTruthy();

    expect(lineBreak.props.children).toBe('\n');
  });
});
