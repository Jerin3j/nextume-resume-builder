import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans & Pro Upgrade | Nextume.in",
  description:
    "Affordable lifetime plans for Nextume AI Resume Builder and Portfolio Platform. Unlimited resumes, ATS checks, code editing, and subdomain portfolios for ₹99.",
  keywords: [
    "Nextume Pricing",
    "AI Resume Builder Pricing",
    "Affordable Resume Builder India",
    "Portfolio Website Maker Pro",
  ],
  alternates: {
    canonical: "https://nextume.in/pricing",
  },
  openGraph: {
    title: "Nextume.in Pricing & Plans",
    description: "Compare Free and Pro features for Nextume AI Resume Platform.",
    url: "https://nextume.in/pricing",
    images: ["/site-preview.png"],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
