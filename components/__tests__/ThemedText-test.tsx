import * as React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react-native';

import { ThemedText } from '../ThemedText';

jest.mock('@/constants/Colors', () => ({
  GlobalStyles: {
    font: 'Arial',
    fontBold: 'Arial-Bold',
    darkGrey: '#333333',
    grey: '#666666',
    blue: '#2196F3',
  },
}));

describe('ThemedText', () => {
  it('renders correctly with default type', () => {
    const tree = renderer.create(<ThemedText>Default text</ThemedText>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with title type', () => {
    const tree = renderer.create(<ThemedText type="title">Title text</ThemedText>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with defaultBold type', () => {
    const tree = renderer.create(<ThemedText type="defaultBold">Bold text</ThemedText>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with subtitle type', () => {
    const tree = renderer.create(<ThemedText type="subtitle">Subtitle text</ThemedText>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('applies custom style correctly', () => {
    const customStyle = { color: 'red', fontSize: 24 };
    const { getByText } = render(
      <ThemedText style={customStyle}>Custom styled text</ThemedText>
    );
    
    const textElement = getByText('Custom styled text');
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });

  it('applies both type style and custom style correctly', () => {
    const customStyle = { color: 'red', fontSize: 24 };
    const { getByText } = render(
      <ThemedText type="title" style={customStyle}>Combined styled text</ThemedText>
    );
    
    const textElement = getByText('Combined styled text');
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });

  it('passes additional props to Text component', () => {
    const { getByTestId } = render(
      <ThemedText testID="test-id" numberOfLines={2}>Text with props</ThemedText>
    );
    
    const textElement = getByTestId('test-id');
    expect(textElement.props.numberOfLines).toBe(2);
  });
});
