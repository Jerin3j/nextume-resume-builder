import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";


const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nextume",
  description: "Nextume by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${outfitFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
