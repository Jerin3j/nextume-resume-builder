import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/redux/store";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import ClientLayout from "./ClientLayout";

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
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}
