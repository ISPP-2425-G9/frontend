import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import RegisterScreen from "../register";
import { NavigationContainer } from "@react-navigation/native";
import { NotificationProvider } from "@/context/NotificationContext";

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve('mock-token')),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  }));

  jest.mock('expo-font', () => ({
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn(),
  }));
  

  const companyFields = [
    {
      name: "name",
      placeholder: "Empresa S.L.",
      description: "Nombre",
      maxLength: 50
    },
    {
      name: "description",
      placeholder: "Descripción",
      description: "Descripción",
      maxLength: 500,
    },
    {
      name: "companyType",
      placeholder: "Tipo de empresa",
      description: "Tipo",
    },
    { name: "nif", placeholder: "A01024892", description: "NIF" },
    {
      name: "email",
      placeholder: "ejemplo@mail.com",
      keyboardType: "email-address",
      description: "Email",
      maxLength: 50,
    },
    {
      name: "telephone",
      placeholder: "600 000 000",
      keyboardType: "phone-pad",
      description: "Teléfono",
    },
    {
      name: "address",
      placeholder: "Calle, número, piso, etc.",
      description: "Dirección",
      maxLength: 75,
    },
    {
      name: "city", placeholder: "Ciudad", description: "Ciudad", maxLength: 50,
    },

    {
      name: "zipCode",
      placeholder: "41012",
      description: "Código postal",
      keyboardType: "numeric",
    },
    {
      name: "password1",
      placeholder: "******",
      secureTextEntry: true,
      description: "Contraseña",
      maxLength: 36,
    },
    {
      name: "password2",
      placeholder: "******",
      secureTextEntry: true,
      description: "Confirmar contraseña",
      maxLength: 36,
    },
  ];


  let documentTitle = ''
  const mockDocument = {
    get title() {
      return documentTitle;
    },
    set title(value) {
      documentTitle = value;
    }
  };
  
  if (typeof global.document !== 'undefined') {
    Object.defineProperty(global.document, 'title', {
      get: () => documentTitle,
      set: (value) => { documentTitle = value; },
      configurable: true
    });
  } else {
    global.document = mockDocument as any;
  }

describe('RegisterScreen', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        documentTitle = '';
      });
    

      it('should render', async () => {
        const {getByTestId} = render(<NavigationContainer><NotificationProvider><RegisterScreen/></NotificationProvider></NavigationContainer>);
        await waitFor(()=> {
            expect(getByTestId('no-type-view')).toBeTruthy()
        })
        });

        it('should select type', async () => {
            const {getAllByTestId, getByTestId} = render(<NavigationContainer><NotificationProvider><RegisterScreen/></NotificationProvider></NavigationContainer>);
            await waitFor(()=> {
                expect(getByTestId('no-type-view')).toBeTruthy()
            })
            const typeButton = getAllByTestId('custom-button');
            fireEvent.press(typeButton[0]);
            await waitFor(()=> {
                expect(getByTestId('selected-type-view')).toBeTruthy()
            })
            });

        it('should select type 2', async () => {
            const {getAllByTestId, getByTestId} = render(<NavigationContainer><NotificationProvider><RegisterScreen/></NotificationProvider></NavigationContainer>);
            await waitFor(()=> {
                expect(getByTestId('no-type-view')).toBeTruthy()
            })
            const typeButton = getAllByTestId('custom-button');
            fireEvent.press(typeButton[1]);
            await waitFor(()=> {
                expect(getByTestId('selected-type-view')).toBeTruthy()
            })
            });

})