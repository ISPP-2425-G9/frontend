import React from 'react';
import { render } from '@testing-library/react-native';
import AdvertisementSponsor from '../AdvertisementSponsor';
import { useWindowDimensions } from 'react-native';

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    width: 1024,
    height: 1024,
  }))
}));

const mockSponsor = {
  name: 'Test Sponsor',
  email: 'sponsor@example.com',
  telephone: '123456789',
  address: '123 Sponsor St',
  city: 'Sponsor City',
  zipCode: '12345',
  imageUrl: 'https://via.placeholder.com/150',
  description: 'This is a test sponsor description.',
  nif: '123456789',
};

describe('AdvertisementSponsor Component', () => {
  const mockUseWindowDimensions = useWindowDimensions as unknown as jest.Mock;

  it('renders correctly in desktop layout', () => {
    mockUseWindowDimensions.mockImplementation(() => ({
      width: 1024,
      height: 1024,
    }));

    const { getByTestId, getByText } = render(<AdvertisementSponsor sponsor={mockSponsor} />);

    const container = getByTestId('sponsor-container');
    const image = getByTestId('sponsor-image');

    expect(container.props.style).toContainEqual(
      expect.objectContaining({
        flexDirection: 'row',
      })
    );

    expect(image.props.style).toContainEqual(
      expect.objectContaining({
        width: 175,
        height: 210,
        marginRight: 15,
      })
    );

    expect(getByText('📞 123 456 789')).toBeTruthy();
    expect(getByText(`✉️ ${mockSponsor.email}`)).toBeTruthy();
    expect(getByText(`📍 ${mockSponsor.address}, ${mockSponsor.city}, ${mockSponsor.zipCode}`)).toBeTruthy();
    expect(getByText(`🆔 NIF: ${mockSponsor.nif}`)).toBeTruthy();
    expect(getByText(mockSponsor.description)).toBeTruthy();
  });

  it('renders correctly in mobile layout', () => {
    mockUseWindowDimensions.mockImplementation(() => ({
      width: 375,
      height: 667,
    }));

    const { getByTestId, getByText } = render(<AdvertisementSponsor sponsor={mockSponsor} />);

    const container = getByTestId('sponsor-container');
    const image = getByTestId('sponsor-image');

    expect(container.props.style).toContainEqual(
      expect.objectContaining({
        flexDirection: 'column',
      })
    );

    expect(image.props.style).toContainEqual(
      expect.objectContaining({
        width: 165,
        height: 130,
        marginBottom: 10,
      })
    );

    expect(getByText('📞 123 456 789')).toBeTruthy();
    expect(getByText(`✉️ ${mockSponsor.email}`)).toBeTruthy();
    expect(getByText(`📍 ${mockSponsor.address}, ${mockSponsor.city}, ${mockSponsor.zipCode}`)).toBeTruthy();
    expect(getByText(`🆔 NIF: ${mockSponsor.nif}`)).toBeTruthy();
    expect(getByText(mockSponsor.description)).toBeTruthy();
  });
});
