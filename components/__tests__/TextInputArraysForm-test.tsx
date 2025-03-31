import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TextInputArraysForm from '../TextInputArraysForm';

const mockOnSubmit = jest.fn();

jest.mock('@expo/vector-icons', () => ({
    AntDesign: 'AntDesign',
  }));
  
  jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(() =>
      Promise.resolve({
        canceled: false,
        assets: [{ uri: 'mocked-image-uri' }]
      })
    ),
    MediaTypeOptions: {
      Images: 'image',
    },
  }));

describe('TextInputArraysForm', () => {
  it('render title and description', () => {
    const { getByText } = render(
      <TextInputArraysForm
        title="Text form"
        description="This is a description"
        inputs={[]}
        onSubmit={mockOnSubmit}
      />
    );

    expect(getByText('Text form')).toBeTruthy();
    expect(getByText('This is a description')).toBeTruthy();
  });

  it('render inputs properly', () => {
    const { getByPlaceholderText } = render(
      <TextInputArraysForm
        title="Test Form"
        inputs={[{ name: 'testInput', placeholder: 'Lorem ipsum' }]}
        onSubmit={mockOnSubmit}
      />
    );

    const input = getByPlaceholderText('Lorem ipsum');
    fireEvent.changeText(input, 'New value');

    expect(input.props.value).toBe('New value');
  });

  it('run onSubmit function with correct values', () => {
    const { getByText, getByPlaceholderText } = render(
      <TextInputArraysForm
        title="Test Form"
        inputs={[{ name: 'testInput', placeholder: 'Lorem ipsum' }]}
        onSubmit={mockOnSubmit}
      />
    );

    const input = getByPlaceholderText('Lorem ipsum');
    fireEvent.changeText(input, 'New value');

    fireEvent.press(getByText('Enviar'));
    expect(mockOnSubmit).toHaveBeenCalledWith({ testInput: 'New value' });
  });

  it('close form when close button is pressed', () => {
    const mockHandleClose = jest.fn();
    const { getByTestId } = render(
      <TextInputArraysForm
        title="Test Form"
        inputs={[]}
        onSubmit={mockOnSubmit}
        handleFormClose={mockHandleClose}
      />
    );

    fireEvent.press(getByTestId('close-button'));
    expect(mockHandleClose).toHaveBeenCalled();
  });

it('allow pick images', async () => {
    const mockOnSubmit = jest.fn();
  
    const { getByText } = render(
      <TextInputArraysForm
        title="Test Form"
        inputs={[]}
        imageFields={['imagen']}
        onSubmit={mockOnSubmit}
      />
    );
  
    fireEvent.press(getByText('Seleccionar imagen'));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

});