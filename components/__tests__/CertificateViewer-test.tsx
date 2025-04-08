import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CertificateViewer from '@/app/admin/certificateViewer';
import { AUTHORITIES } from '../../app/_util/Authorities';
import { withAuth } from '../../app/_util/withAuth';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomButton from '../CustomButton';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

jest.mock('../../app/_util/withAuth', () => ({
  withAuth: (Component: any) => Component,
}));

describe('CertificateViewer screen', () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: navigateMock });
  });

  it('render correctly a valid certificateUrl', () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        certificateUrl: 'https://example.com/certificate.png',
      },
    });

    const { getByTestId, getByText } = render(<CertificateViewer />);

    expect(getByTestId('custom-button')).toBeTruthy();
    expect(getByText('Volver al listado')).toBeTruthy();
  });

  it('show error message if there is not certificateUrl', () => {
    (useRoute as jest.Mock).mockReturnValue({ params: {} });

    const { getByText } = render(<CertificateViewer />);

    expect(getByText('No se encontró el certificado.')).toBeTruthy();
    expect(getByText('Volver al listado')).toBeTruthy();
  });

  it('navigate to the other screen when pressing the button', () => {
    (useRoute as jest.Mock).mockReturnValue({ params: {} });

    const { getByText } = render(<CertificateViewer />);
    const button = getByText('Volver al listado');

    fireEvent.press(button);

    expect(navigateMock).toHaveBeenCalledWith('admin/certificatesManagement');
  });
});
