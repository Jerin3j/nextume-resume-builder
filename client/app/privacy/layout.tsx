import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Nextume.in",
  description: "Learn how Nextume protects your personal information, resume data, and payment details.",
  alternates: {
    canonical: "https://nextume.in/privacy",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
