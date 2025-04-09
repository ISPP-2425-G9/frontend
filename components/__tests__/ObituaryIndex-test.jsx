import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import ObituaryIndex from '@/app/obituaries';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/context/NotificationContext';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/context/NotificationContext', () => ({
  useNotification: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { id: 1, imageId: 1, imageUrl: 'http://example.com/obituary1.jpg' },
        { id: 2, imageId: 2, imageUrl: 'http://example.com/obituary2.jpg' },
      ]),
  })
);

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() =>
    Promise.resolve(JSON.stringify({ roles: ["CUSTOMER_PREMIUM"] }))
  ),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
    useRoute: () => ({
      params: {
        is_newObituary: true,
        changeDesign: false,
        obituaryId: 123,
        jsonData: '{}',
        is_mine: false,
        selectedColor: '#ffffff',
      },
    }),
    useFocusEffect: jest.fn().mockImplementation((cb) => cb()),
  };
});

beforeEach(() => {
  useAuth.mockReturnValue({
    isAuthenticated: true,
    user: { id: 'user123', name: 'Test User' },
    loading: false,
  });

  useNotification.mockReturnValue({
    showNotification: jest.fn(),
  });

  jest.clearAllMocks();
});

const renderWithNavigation = (component) => {
  return render(
    <NavigationContainer>
      {component}
    </NavigationContainer>
  );
};

describe('ObituaryIndex screen', () => {
    const renderWithNavigation = (component) => {
      return render(
        <NavigationContainer>
          {component}
        </NavigationContainer>
      );
    };

    it('renders after fetch resolves', async () => {
        renderWithNavigation(<ObituaryIndex />);

        await waitFor(() => {
          expect(screen.queryByText('Cargando...')).toBeNull();
        });

    });
      

    // it('should render all key texts and images', async () => {
    //   renderWithNavigation(<ObituaryIndex />);
      
    //   // Espera a que se resuelva el estado de "loading"
    //   await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
    //   screen.debug()
    //   await waitFor(()=> {
    //     expect(screen.getByText('📜 Esquelas 📜')).toBeTruthy();
    //     expect(screen.getByText(/crear esquelas personalizadas/i)).toBeTruthy();
    //     expect(screen.getByTestId('obituary-image-1')).toBeTruthy();
    //     expect(screen.getByTestId('obituary-image-2')).toBeTruthy();
    //   })
    //  });
  
    // it('opens modal when image is pressed', async () => {
    //   renderWithNavigation(<ObituaryIndex />);
    //   await waitFor(() => expect(screen.getByTestId('obituary-image-1')).toBeTruthy());
  
    //   const imageButton = screen.getAllByRole('button')[1];
    //   fireEvent.press(imageButton);
  
    //   await waitFor(() => {
    //     expect(screen.getByText('¿Para quién es la esquela?')).toBeTruthy();
    //   });
    // });
  
    // it('navigates to list of user obituaries', async () => {
    //   renderWithNavigation(<ObituaryIndex />);
    //   const myObituariesButton = await screen.findByText(/tus esquelas/i);
    //   fireEvent.press(myObituariesButton);
  
    //   expect(require('@react-navigation/native').useNavigation().navigate).toHaveBeenCalledWith('obituaries/listMyObituaries');
    // });
  });
  
