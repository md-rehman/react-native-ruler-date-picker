import type { Metadata } from "next";
import { ThemeProvider } from "../context/ThemeContext";
import "./globals.css";
import "../styles/glass.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://md-rehman.dev/react-native-ruler-date-picker"),
  title: "react-native-ruler-date-picker — Smooth 60 FPS Horizontal Ruler Date Picker",
  description: "A performant, customizable horizontal ruler date picker & scroll wheel for React Native and Expo. Powered by 60 FPS Reanimated 3 physics and dual-speed haptic feedback.",
  icons: {
    icon: [
      { url: '/react-native-ruler-date-picker/icon.svg', type: 'image/svg+xml' },
      { url: '/react-native-ruler-date-picker/favicon.ico' }
    ],
    apple: '/react-native-ruler-date-picker/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
