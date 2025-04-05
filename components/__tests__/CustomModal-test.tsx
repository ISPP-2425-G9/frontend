import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomModal from '../CustomModal';
import { Text } from 'react-native';

jest.mock('expo-font');
jest.mock('@expo/vector-icons', () => ({
  AntDesign: jest.fn(() => null),
}));


describe('CustomModal Component', () => {
  it('renders correctly when visible', () => {
    const { getByTestId } = render(<CustomModal visible={true} onClose={() => {}} />);
    expect(getByTestId('custom-modal')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByTestId } = render(<CustomModal visible={false} onClose={() => {}} />);
    expect(queryByTestId('custom-modal')).toBeNull();
  });

  it('calls onClose when close button is pressed', () => {
    const mockOnClose = jest.fn();
    const { getByTestId } = render(<CustomModal visible={true} onClose={mockOnClose} />);
    
    fireEvent.press(getByTestId('close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders the given title', () => {
    const { getByText } = render(<CustomModal visible={true} onClose={() => {}} title="Test Title" />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('renders children inside the modal', () => {
    const { getByText } = render(
      <CustomModal visible={true} onClose={() => {}}>
        <Text>Modal Content</Text>
      </CustomModal>
    );
    expect(getByText('Modal Content')).toBeTruthy();
  });
});