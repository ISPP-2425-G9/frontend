import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Contact from "@/app/contact";
import { Linking } from "react-native";
import { NotificationProvider } from "@/context/NotificationContext";

jest.mock("expo-font", () => ({
  isLoaded: true,
  useFonts: () => [true],
}));

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useFocusEffect: jest.fn(),
  useNavigation: jest.fn().mockReturnValue({ navigate: jest.fn() }),
}));

jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

jest.mock("react-native-vector-icons/FontAwesome6", () => {
  return {
    __esModule: true,
    default: "FontAwesome6",
  };
});

describe("Contact Screen", () => {
  const renderWithNavigation = (component: React.ReactElement) => {
    return render(
      <NavigationContainer>
        <NotificationProvider>{component}</NotificationProvider>
      </NavigationContainer>
    );
  };

  it("renders without crashing", () => {
    const { getByText } = renderWithNavigation(<Contact />);
    expect(getByText("Contáctanos")).toBeTruthy();
  });

  it("renders input fields and submit button", () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation(
      <Contact />
    );
    expect(getByPlaceholderText("Nombre")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Tu mensaje")).toBeTruthy();
    expect(getByText("Enviar")).toBeTruthy();
  });

  it("opens mailto link when form is submitted with valid data", async () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation(
      <Contact />
    );

    fireEvent.changeText(getByPlaceholderText("Nombre"), "John Doe");
    fireEvent.changeText(getByPlaceholderText("Email"), "john.doe@example.com");
    fireEvent.changeText(getByPlaceholderText("Tu mensaje"), "Test message");

    fireEvent.press(getByText("Enviar"));

    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(
        expect.stringContaining("mailto:info@caronte.site")
      );
    });
  });

  it("opens mailto link when clicking the contact email", () => {
    const { getByText } = renderWithNavigation(<Contact />);
    const emailLink = getByText("info@caronte.site");
    fireEvent.press(emailLink);

    expect(Linking.openURL).toHaveBeenCalledWith(
      expect.stringContaining("mailto:info@caronte.site")
    );
  });

  it("opens tel link when clicking the phone number", () => {
    const { getByText } = renderWithNavigation(<Contact />);
    const phoneLink = getByText("+34 615 14 52 15");
    fireEvent.press(phoneLink);

    expect(Linking.openURL).toHaveBeenCalledWith(
      expect.stringContaining("tel:+34615145215")
    );
  });

  it("renders the social media icons and opens their respective URLs when pressed", () => {
    const { getByTestId } = renderWithNavigation(<Contact />);
    
    const socialIcons = [
      { name: "whatsapp", url: "https://whatsapp.com/channel/0029Vb8vAcUDzgTBG01Tdw1f" },
      { name: "linkedin", url: "https://www.linkedin.com/in/caronte-app/" },
      { name: "facebook", url: "https://www.facebook.com/profile.php?id=61573575124143" },
      { name: "x-twitter", url: "https://x.com/CaronteApp" },
      { name: "instagram", url: "https://instagram.com/caronte_es" },
      { name: "tiktok", url: "https://www.tiktok.com/@caronteapp" },
      { name: "github", url: "https://github.com/ISPP-2425-G9" }
    ];

    socialIcons.forEach(({ name, url }) => {
      const icon = getByTestId(name);
      fireEvent.press(icon);
      expect(Linking.openURL).toHaveBeenCalledWith(url);
    });
  });
});
