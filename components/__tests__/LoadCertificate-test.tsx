import { render, fireEvent, screen, waitFor } from "@testing-library/react-native";
import LoadCertificate from "../../app/certificate/index"; // Adjust path to your file
import { useNotification } from '@/context/NotificationContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { NavigationContainer } from "@react-navigation/native";


jest.mock('../../context/NotificationContext', () => ({
    showNotification: jest.fn(),
  }));
  

// Mock the necessary modules
jest.mock("@/context/NotificationContext", () => ({
  useNotification: jest.fn(),
}));

global.document = {
  title: ''
};


jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: {
      All: 'all', // or whatever the appropriate value is for 'All'
    },
  }));
  

// Set up mock for useNotification hook
const showNotification = jest.fn();
useNotification.mockReturnValue({
  showNotification,
});


// Create a simple navigation wrapper for the test
const TestWrapper = () => (
  <NavigationContainer>
    <LoadCertificate></LoadCertificate>
  </NavigationContainer>
);

describe("LoadCertificate Screen", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("should render the screen properly", () => {
    render(<TestWrapper />);

    // Check if certain elements are rendered
    expect(screen.getByText(/Certificados de defunción/i)).toBeTruthy();
    expect(screen.getByText(/Seleccionar archivo/i)).toBeTruthy();
    expect(screen.getByText(/Subir certificado de defunción/i)).toBeTruthy();
  });

  it("should show a notification when the image format is invalid", async () => {
    // Mock the image picker result
    ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [
        {
          mimeType: "image/gif", // Invalid format
          uri: "image.gif",
        },
      ],
    });

    render(<TestWrapper />);

    // Trigger image picker
    fireEvent.press(screen.getByText("Seleccionar archivo"));

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Solo se permiten imágenes en formato PNG, JPG o JPEG.",
        })
      );
    });
  });

//     render(<TestWrapper />);

//     // Enter an invalid DNI
//     fireEvent.changeText(screen.getByPlaceholderText("DNI del fallecido"), "12345");

//     await waitFor(() => {
//       expect(showNotification).toHaveBeenCalledWith(
//         expect.objectContaining({
//           message: "El DNI debe tener 8 números y una letra mayúscula",
//         })
//       );
//     });
//   });


// it('should show confirmation modal on valid DNI and image', async () => {
//     const { getByPlaceholderText, getByText, getByTestId } = render(  <NavigationContainer><LoadCertificate/></NavigationContainer>);

//     fireEvent.changeText(getByPlaceholderText("DNI del fallecido"), "12345678A");

//     fireEvent.press(getByTestId('custom-button')); // Assuming this triggers the image selection

//     // Simulate uploading a valid image (mock the image selection process)
//     const fakeImage = { uri: 'fake-image.jpg' };
//     // You can mock the image picker return value if needed
//     mockImagePicker(fakeImage);

//     // Trigger the validation or action that would lead to showing the modal
//     fireEvent.press(getByText("Subir certificado de defunción"));  // Assuming this triggers the upload

//     // Wait for the modal to appear
//     await waitFor(() => {
//       expect(screen.getByText(/Una vez subido el certificado de defunción/i)).toBeTruthy();
//     });
//   });

//   it("should handle file upload successfully", async () => {
//     // Mock AsyncStorage and image picker result
//     AsyncStorage.getItem.mockResolvedValueOnce("fakeAuthToken");
//     ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
//       canceled: false,
//       assets: [
//         {
//           mimeType: "image/jpeg", // Valid format
//           uri: "image.jpg",
//           fileName: "certificate.jpg",
//         },
//       ],
//     });

//     render(<TestWrapper />);

//     // Enter valid DNI
//     fireEvent.changeText(screen.getByPlaceholderText("DNI del fallecido"), "12345678A");

//     // Trigger image picker
//     fireEvent.press(screen.getByText("Seleccionar archivo"));

//     // Trigger modal
//     fireEvent.press(screen.getByText("Subir certificado de defunción"));

//     // Simulate button click inside modal
//     fireEvent.press(screen.getByText("Aceptar"));

//     await waitFor(() => {
//       expect(showNotification).not.toHaveBeenCalled(); // No error notifications
//     });
//   });

//   it("should handle error during file upload", async () => {
//     // Mock AsyncStorage and image picker result
//     AsyncStorage.getItem.mockResolvedValueOnce("fakeAuthToken");
//     ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
//       canceled: false,
//       assets: [
//         {
//           mimeType: "image/jpeg", // Valid format
//           uri: "image.jpg",
//           fileName: "certificate.jpg",
//         },
//       ],
//     });

//     // Mock fetch to simulate a failed response
//     global.fetch = jest.fn().mockResolvedValueOnce({
//       ok: false,
//       json: jest.fn().mockResolvedValueOnce({ error: "Error uploading data" }),
//     });

//     render(<TestWrapper />);

//     // Enter valid DNI
//     fireEvent.changeText(screen.getByPlaceholderText("DNI del fallecido"), "12345678A");

//     // Trigger image picker
//     fireEvent.press(screen.getByText("Seleccionar archivo"));

//     // Trigger modal
//     fireEvent.press(screen.getByText("Subir certificado de defunción"));

//     // Simulate button click inside modal
//     fireEvent.press(screen.getByText("Aceptar"));

//     await waitFor(() => {
//       expect(showNotification).toHaveBeenCalledWith(
//         expect.objectContaining({
//           message: "Error uploading data",
//         })
//       );
//     });
//   });
});
