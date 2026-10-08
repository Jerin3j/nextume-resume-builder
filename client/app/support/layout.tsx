import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support & Help Center | Nextume.in",
  description:
    "Get help with Nextume AI Resume Builder, ATS score reports, subdomain portfolios, account settings, and payments.",
  alternates: {
    canonical: "https://nextume.in/support",
  },
  openGraph: {
    title: "Nextume.in Help & Support",
    description: "Troubleshooting, FAQs, and contact for Nextume AI Resume Builder.",
    url: "https://nextume.in/support",
    images: ["/site-preview.png"],
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
