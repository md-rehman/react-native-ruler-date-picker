import type { Metadata } from "next";
import { ThemeProvider } from "../context/ThemeContext";
import "./globals.css";
import "../styles/glass.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://md-rehman.dev/react-native-ruler-date-picker"),
  title: {
    default: "react-native-ruler-date-picker — Smooth 60 FPS Horizontal Ruler Date Picker",
    template: "%s | react-native-ruler-date-picker",
  },
  description:
    "A performant, customizable horizontal ruler date picker & scroll wheel for React Native and Expo. Powered by 60 FPS Reanimated 3 physics, dual-speed haptic feedback, and fluid date range selection.",
  applicationName: "react-native-ruler-date-picker",
  authors: [{ name: "Rehman", url: "https://md-rehman.dev" }],
  creator: "Rehman",
  publisher: "Rehman",
  generator: "Next.js",
  keywords: [
    "react-native",
    "react-native-date-picker",
    "react-native-date-range-picker",
    "date-picker",
    "date-range-picker",
    "ruler-date-picker",
    "ruler-picker",
    "ruler",
    "horizontal-date-picker",
    "scroll-picker",
    "wheel-picker",
    "calendar-strip",
    "timeline-picker",
    "timeline",
    "expo",
    "expo-date-picker",
    "reanimated",
    "reanimated-3",
    "haptics",
    "gesture-handler",
    "ui-components",
    "ios",
    "android",
  ],
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "react-native-ruler-date-picker — Smooth 60 FPS Horizontal Ruler Date Picker",
    description:
      "A performant, customizable horizontal ruler date picker & scroll wheel for React Native and Expo. Powered by 60 FPS Reanimated 3 physics, dual-speed haptic feedback, and compound anatomy.",
    url: "https://md-rehman.dev/react-native-ruler-date-picker",
    siteName: "react-native-ruler-date-picker",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/react-native-ruler-date-picker/og-image.png",
        width: 1200,
        height: 630,
        alt: "react-native-ruler-date-picker Hero and Interactive Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "react-native-ruler-date-picker — Smooth 60 FPS Horizontal Ruler Date Picker",
    description:
      "A performant, customizable horizontal ruler date picker & scroll wheel for React Native and Expo. Powered by 60 FPS Reanimated 3 physics and dual-speed haptic feedback.",
    creator: "@mdrehman_dev",
    images: ["/react-native-ruler-date-picker/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/react-native-ruler-date-picker/icon.svg", type: "image/svg+xml" },
      { url: "/react-native-ruler-date-picker/favicon.ico" },
    ],
    apple: "/react-native-ruler-date-picker/icon.svg",
  },
  manifest: "/react-native-ruler-date-picker/manifest.webmanifest",
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://md-rehman.dev/react-native-ruler-date-picker/#website",
      url: "https://md-rehman.dev/react-native-ruler-date-picker",
      name: "react-native-ruler-date-picker",
      description:
        "A performant, customizable horizontal ruler date picker & scroll wheel for React Native and Expo.",
      publisher: {
        "@type": "Person",
        name: "Rehman",
        url: "https://md-rehman.dev",
      },
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://md-rehman.dev/react-native-ruler-date-picker/#software",
      name: "react-native-ruler-date-picker",
      programmingLanguage: ["TypeScript", "JavaScript"],
      runtimePlatform: ["React Native", "Expo", "iOS", "Android", "Web"],
      codeRepository: "https://github.com/md-rehman/react-native-ruler-date-picker",
      license: "https://opensource.org/licenses/MIT",
      description:
        "A performant, customizable horizontal ruler date picker & scroll wheel for React Native and Expo. Powered by 60 FPS Reanimated 3 physics and dual-speed haptic feedback.",
      version: "0.2.0",
      author: {
        "@type": "Person",
        name: "Rehman",
        url: "https://md-rehman.dev",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
