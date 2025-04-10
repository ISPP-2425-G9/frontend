import { render, fireEvent } from '@testing-library/react-native';
import { openBrowserAsync } from 'expo-web-browser';
import { Platform } from 'react-native';
import { ExternalLink } from '@/components/ExternalLink';

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(),
}));

describe('<ExternalLink />', () => {
  it('opens the link in an in-app browser on native platforms', async () => {
    Platform.OS = 'ios';
    const { getByText } = render(<ExternalLink href="https://example.com">Click Me</ExternalLink>);

    const link = getByText('Click Me');
    
    const event = {
      preventDefault: jest.fn(),
    };

    await link.props.onPress(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
    expect(openBrowserAsync).toHaveBeenCalledWith('https://example.com');
  });

  it('does not prevent default behavior on web platform', async () => {
    Platform.OS = 'web';
    const { getByText } = render(<ExternalLink href="https://example.com">Click Me</ExternalLink>);

    const link = getByText('Click Me');
    
    const event = {
      preventDefault: jest.fn(),
    };

    await link.props.onPress(event);
    
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
