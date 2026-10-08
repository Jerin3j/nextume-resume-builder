import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#4F39F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nextume.in"),
  title: {
    default: "Nextume | AI Resume Builder, ATS Score Scanner & Subdomain Portfolios",
    template: "%s | Nextume.in",
  },
  description:
    "Build ATS-friendly resumes in minutes, get instant AI ATS compatibility scores with missing keyword feedback, and deploy personal developer portfolio websites on your custom subdomain (yourname.nextume.in).",
  applicationName: "Nextume AI Resume Platform",
  authors: [{ name: "Jerin Jerome Justin", url: "https://nextume.in" }],
  generator: "Next.js",
  keywords: [
    "AI Resume Builder",
    "Nextume",
    "Nextume.in",
    "nextume",
    "ATS Resume Checker",
    "ATS Score Scanner",
    "Free AI Resume Generator",
    "Subdomain Portfolio Builder",
    "Personal Developer Portfolio",
    "AI Cover Letter Generator",
    "Resume to Website Converter",
    "Best Resume Builder 2026",
    "ATS Friendly Resume Maker",
    "Jerin Jerome Justin",
  ],
  creator: "Jerin Jerome Justin",
  publisher: "Nextume.in",
  category: "Career & Resume Tools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://nextume.in",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nextume.in",
    siteName: "Nextume.in",
    title: "Nextume | AI Resume Builder, ATS Score Scanner & Subdomain Portfolios",
    description:
      "Build ATS-friendly resumes in minutes, get instant AI ATS compatibility scores, and deploy your personal portfolio on your custom subdomain (yourname.nextume.in).",
    images: [
      {
        url: "/site-preview.png",
        width: 1200,
        height: 630,
        alt: "Nextume.in - AI Resume Builder and Subdomain Portfolios",
        type: "image/png",
      },
      {
        url: "/demo-img.png",
        width: 1200,
        height: 630,
        alt: "Nextume.in Live Preview",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nextume | AI Resume Builder, ATS Score Scanner & Subdomain Portfolios",
    description:
      "Build ATS-friendly resumes in minutes, test ATS compatibility, and launch your personal portfolio on your custom subdomain (yourname.nextume.in).",
    images: ["/site-preview.png"],
    creator: "@nextume",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global Structured Data (Schema.org) for Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://nextume.in/#webapp",
        name: "Nextume",
        url: "https://nextume.in",
        applicationCategory: "BusinessApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        description:
          "AI Resume Builder with ATS Score Scanner, Cover Letter Generator, and custom subdomain portfolio hosting.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          description: "Free tier available with upgrade options",
        },
        featureList: [
          "AI Resume Builder with real-time formatting",
          "Automated ATS Resume Compatibility Scanner",
          "Job-Targeted AI Cover Letter Generator",
          "Custom Subdomain Developer Portfolio Hosting (username.nextume.in)",
          "PDF Resume Export and Import",
        ],
        author: {
          "@type": "Person",
          name: "Jerin Jerome Justin",
          url: "https://jerin3j.vercel.app/",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://nextume.in/#organization",
        name: "Nextume",
        url: "https://nextume.in",
        logo: "https://nextume.in/logo.svg",
        sameAs: [
          "https://nextume.in",
          "https://jerin3j.vercel.app/",
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${outfitFont.variable} antialiased font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
