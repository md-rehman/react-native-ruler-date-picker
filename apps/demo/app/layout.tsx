import type { Metadata } from "next";
import { ThemeProvider } from "../context/ThemeContext";
import "./globals.css";
import "../styles/glass.css";

export const metadata: Metadata = {
  title: "Demo | react-native-ruler-date-picker",
  description: "Interactive playground for react-native-ruler-date-picker",
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
