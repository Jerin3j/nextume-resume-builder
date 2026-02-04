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
    (state: RootState) => state.authReducer
  );

  if (loading) {
    return <Loader className="animate-spin" />;
  }

  if (!user) {
    redirect("/login");
  }
if (loading || !user) {
  return <div className="min-h-screen bg-gray-50" />;
}
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {children}
    </div>
  );
}
