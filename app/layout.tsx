import type { Metadata } from "next";
import { Space_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zen-antelope-infinite-orbit.cluster-se1-us.nexlayer.ai";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Infinite Orbit — Recreate the Artemis II Moon Mission",
  description:
    "Combine physics primitives to discover orbital mechanics and build NASA's Artemis II trajectory. An AI-powered space discovery game.",
  openGraph: {
    title: "Infinite Orbit — Recreate the Artemis II Moon Mission",
    description:
      "Combine physics primitives to discover orbital mechanics and build NASA's Artemis II trajectory. An AI-powered space discovery game.",
    url: SITE_URL,
    siteName: "Infinite Orbit",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Infinite Orbit — Earth to Moon trajectory with cyan arc on dark space background",
        type: "image/png",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinite Orbit — Recreate the Artemis II Moon Mission",
    description:
      "Combine physics primitives to discover orbital mechanics and build NASA's Artemis II trajectory.",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Infinite Orbit",
      },
    ],
    creator: "@nexaboratory",
  },
  other: {
    // Reddit and additional platforms
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${ibmPlex.variable} h-full`}>
      <body className="min-h-full bg-black text-white antialiased">{children}</body>
    </html>
  );
}
