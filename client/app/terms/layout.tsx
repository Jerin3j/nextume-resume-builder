import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Nextume.in",
  description: "Terms of service, subscription policies, and usage guidelines for Nextume.in.",
  alternates: {
    canonical: "https://nextume.in/terms",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
