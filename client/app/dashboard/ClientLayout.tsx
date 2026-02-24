"use client";

import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { RootState } from "@/lib/redux/store";
import { Loader } from "lucide-react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useSelector(
    (state: RootState) => state.authReducer,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin w-8 h-8 text-violet-600" />
      </div>
    );
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {children}
    </div>
  );
}
