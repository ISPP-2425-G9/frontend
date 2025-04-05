import React from 'react';
import { render } from '@testing-library/react-native';
import Logo from '../Logo';
import { GlobalStyles } from '@/constants/Colors';

describe('Logo', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<Logo />);
    const logo = getByTestId('logo');
    expect(logo).toBeTruthy();
    expect(logo.props.fill).toBeDefined();
    expect(logo.props.width).toBe(75);
    expect(logo.props.height).toBe(75);
  });

  it('renders with the correct color', () => {
    const { getByTestId } = render(<Logo color="red" />);
    const logo = getByTestId('logo');
    expect(logo.props.fill).toBe(GlobalStyles.red);
  });

  it('renders with the correct size', () => {
    const { getByTestId } = render(<Logo size={100} />);
    const logo = getByTestId('logo');
    expect(logo.props.width).toBe(100);
    expect(logo.props.height).toBe(100);
  });

  it('renders with a custom color and size', () => {
    const { getByTestId } = render(<Logo color="blue" size={50} />);
    const logo = getByTestId('logo');
    expect(logo.props.fill).toBe(GlobalStyles.blue);
    expect(logo.props.width).toBe(50);
    expect(logo.props.height).toBe(50);
  });
});
