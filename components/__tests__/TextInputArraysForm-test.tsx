import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TextInputArraysForm from '../TextInputArraysForm';
import * as ImagePicker from 'expo-image-picker';

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('should handle image selection and update state', async () => {
    const { getByText } = render(
      <TextInputArraysForm
        title="Test Form"
        inputs={[]}
        imageFields={['imagen']}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.press(getByText('Seleccionar imagen'));

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    await waitFor(() => {
      expect(getByText('Seleccionar imagen')).toBeTruthy();
    });
  });

  it('should handle canceled image selection', async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({ canceled: true })
    );

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
      expect(getByText('Seleccionar imagen')).toBeTruthy();
    });
  });

  it('should include image data in form submission', async () => {
    const { getByText } = render(
      <TextInputArraysForm
        title="Test Form"
        inputs={[{ name: 'testInput', placeholder: 'Test' }]}
        imageFields={['imagen']}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.press(getByText('Seleccionar imagen'));

    await waitFor(() => {
      fireEvent.press(getByText('Enviar'));
      
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          imagen: expect.objectContaining({
            uri: 'mocked-image-uri',
            name: expect.any(String),
            type: expect.stringMatching(/^image\/.*$/)
          })
        })
      );
    });
  });

  it('should handle multiple image fields', async () => {
    const { getByText } = render(
      <TextInputArraysForm
        title="Test Form"
        inputs={[]}
        imageFields={['imagen1', 'imagen2']}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.press(getByText('Seleccionar imagen1'));
    fireEvent.press(getByText('Seleccionar imagen2'));

    await waitFor(() => {
      fireEvent.press(getByText('Enviar'));
      
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          imagen1: expect.objectContaining({
            uri: 'mocked-image-uri',
            name: expect.any(String),
            type: expect.stringMatching(/^image\/.*$/)
          }),
          imagen2: expect.objectContaining({
            uri: 'mocked-image-uri',
            name: expect.any(String),
            type: expect.stringMatching(/^image\/.*$/)
          })
        })
      );
    });
  });

  it('should handle image without extension', async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        canceled: false,
        assets: [{ uri: 'content://media/external/images/123' }]
      })
    );

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
      fireEvent.press(getByText('Enviar'));
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        imagen: {
          uri: 'content://media/external/images/123',
          name: '123',
          type: 'image/123'
        }
      });
    });
  });
});