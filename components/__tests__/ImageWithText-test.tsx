import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ImageWithText from '../ImageWithText';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('ImageWithText', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render image and text', () => {
    const onPressMock = jest.fn();
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <ImageWithText 
          image="https://via.placeholder.com/150" 
          text="Test text" 
          onPress={onPressMock}
        />
      </NavigationContainer>
    );
    expect(getByText('Test text')).toBeTruthy();

    const image = getByTestId('image');
    expect(image).toBeTruthy();
    expect(image.props.source.uri).toBe('https://via.placeholder.com/150');
  });

  it('handle press action', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <NavigationContainer>
        <ImageWithText 
          image="https://via.placeholder.com/150" 
          text="Test text" 
          onPress={onPressMock}
        />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Test text'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should handle navigation when redirectTo is provided', () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageWithText 
          image="https://via.placeholder.com/150" 
          text="Test text" 
          redirectTo="TestScreen"
        />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Test text'));
    expect(mockNavigate).toHaveBeenCalledWith('TestScreen');
  });

  it('should be disabled when neither onPress nor redirectTo is provided', () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageWithText 
          image="https://via.placeholder.com/150" 
          text="Test text" 
        />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Test text'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should handle local image source', () => {
    const localImage = { uri: 'test-image.png' };
    const { getByTestId } = render(
      <NavigationContainer>
        <ImageWithText 
          image={localImage} 
          text="Test text" 
        />
      </NavigationContainer>
    );

    const image = getByTestId('image');
    expect(image.props.source).toEqual(localImage);
  });
});
