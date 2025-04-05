import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ImageWithText from '../ImageWithText'; 

describe('ImageWithText', () => {
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

});
