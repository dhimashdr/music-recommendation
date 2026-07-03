import type { Metadata } from "next";
import { dmSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://music-recommendation-theta.vercel.app/"),
  title: "Song Recommendation",
  description: "Find song recommendation that is kinda similar with your input",
  openGraph: {
    images: '/images/dhimashdr.jpg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className={`min-h-full flex flex-col ${dmSans.className} antialiased`}>{children}</body>
    </html>
  );
}
