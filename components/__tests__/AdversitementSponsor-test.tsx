import React from 'react';
import { render } from '@testing-library/react-native';
import AdvertisementSponsor from '../AdvertisementSponsor';

const mockSponsor = {
  name: 'Test Sponsor',
  email: 'sponsor@example.com',
  telephone: '123-456-7890',
  address: '123 Sponsor St',
  city: 'Sponsor City',
  zipCode: '12345',
  imageUrl: 'https://via.placeholder.com/150',
  description: 'This is a test sponsor description.',
  nif: '123456789',
};

describe('AdvertisementSponsor Component', () => {
  it('renders correctly with sponsor details', () => {
    const { getByText, getByTestId } = render(<AdvertisementSponsor sponsor={mockSponsor} />);

    expect(getByText(mockSponsor.name)).toBeTruthy();
    expect(getByText(`✉️ ${mockSponsor.email}`)).toBeTruthy();
    expect(getByText(`📞 ${mockSponsor.telephone}`)).toBeTruthy();
    expect(getByText(`📍 ${mockSponsor.address}, ${mockSponsor.city}, ${mockSponsor.zipCode}`)).toBeTruthy();
    expect(getByText(`🆔 NIF: ${mockSponsor.nif}`)).toBeTruthy();
    expect(getByText(mockSponsor.description)).toBeTruthy();

    // Check if the image is displayed
    const image = getByTestId('sponsor-image');
    expect(image).toBeTruthy();
  });
});
