import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Nextume Dashboard",
  description: "Nextume by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
       {children}
      </div>

  );
}
