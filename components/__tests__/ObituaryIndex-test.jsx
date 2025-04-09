// // __tests__/ObituaryIndex.test.tsx

// import React from 'react';
// import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
// import ObituaryIndex from '@/app/obituaries';
// import { NavigationContainer } from '@react-navigation/native';
// import { useAuth } from '@/hooks/useAuth';  // importación nombrada
// import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';


// jest.mock('@/hooks/useAuth', () => ({
//   useAuth: jest.fn(),
// }));

// global.fetch = jest.fn(() =>
//     Promise.resolve({
//       ok: true,
//       json: () =>
//         Promise.resolve([
//           { id: 1, imageId: 1, imageUrl: 'http://example.com/obituary1.jpg' },
//           { id: 2, imageId: 2, imageUrl: 'http://example.com/obituary2.jpg' },
//         ]),
//     })
//   );
  

// jest.mock('@react-native-async-storage/async-storage', () => ({
//     getItem: jest.fn(),
//     setItem: jest.fn(),
//     removeItem: jest.fn(),
//   }));

// jest.mock('@react-navigation/native', () => {
//   const actual = jest.requireActual('@react-navigation/native');
//   return {
//     ...actual,
//     useNavigation: () => ({
//       navigate: jest.fn(),
//     }),
//     useRoute: () => ({
//       params: {
//         is_newObituary: true,
//         changeDesign: false,
//         obituaryId: 123,
//         jsonData: '{}',
//         is_mine: false,
//         selectedColor: '#ffffff',
//       },
//     }),
//     useFocusEffect: jest.fn().mockImplementation((cb) => cb()),
//   };
// });

// beforeEach(() => {
//     // Simula el estado de autenticación
//     useAuth.mockReturnValue({
//       isAuthenticated: true, // Usuario autenticado
//       user: { id: 'user123', name: 'Test User' },
//       loading: false, // Asegura que no haya carga
//     });
//   })

// describe('ObituaryIndex', () => {
//     const renderWithNavigation = (component) => {
//         return render(
//             <NavigationContainer>
//                 {component}
//             </NavigationContainer>
//         );
//     };


//     it('renders correctly', async () => {
//         renderWithNavigation(<ObituaryIndex />);
//         console.log('Rendering ObituaryIndex...');

//         screen.debug(); 

//         // Espera a que los obituarios se carguen y que el componente deje de estar en "loading"
//         await waitFor(() => {
//             const headerText = screen.getByText('Cargando...');
//             expect(headerText).toBeTruthy();
//           });
//         });
// });
