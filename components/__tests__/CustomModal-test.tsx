import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import CustomModal, { CustomModalRef } from '../CustomModal';

jest.mock('expo-font');
jest.mock('@expo/vector-icons', () => ({
  AntDesign: jest.fn(() => null),
}));

jest.mock('../Notification', () => {
  const { Text } = require('react-native');
  return function MockNotification({ message, onHide }: { message: string; onHide?: () => void }) {
    return <Text testID="notification">{message}</Text>;
  };
});

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
    const { Text } = require('react-native');
    const { getByText } = render(
      <CustomModal visible={true} onClose={() => {}}>
        <Text>Modal Content</Text>
      </CustomModal>
    );
    expect(getByText('Modal Content')).toBeTruthy();
  });

  it('shows and hides notification using ref', () => {
    const ref = React.createRef<CustomModalRef>();
    const { queryByTestId } = render(
      <CustomModal
        ref={ref}
        visible={true}
        onClose={() => {}}
      />
    );

    expect(queryByTestId('notification')).toBeNull();

    act(() => {
      ref.current?.showNotification({
        message: 'Test notification',
        type: 'success',
        duration: 3000
      });
    });

    expect(queryByTestId('notification')).toBeTruthy();
    expect(queryByTestId('notification')).toHaveTextContent('Test notification');

    act(() => {
      ref.current?.hideNotification();
    });

    expect(queryByTestId('notification')).toBeNull();
  });

  it('hides notification when closing modal', () => {
    const ref = React.createRef<CustomModalRef>();
    const { getByTestId, queryByTestId } = render(
      <CustomModal
        ref={ref}
        visible={true}
        onClose={() => {}}
      />
    );

    act(() => {
      ref.current?.showNotification({
        message: 'Test notification'
      });
    });

    expect(queryByTestId('notification')).toBeTruthy();

    fireEvent.press(getByTestId('close-button'));

    expect(queryByTestId('notification')).toBeNull();
  });
});