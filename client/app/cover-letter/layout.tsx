import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator | Tailored Job Applications - Nextume.in",
  description:
    "Generate highly customized, recruiter-winning cover letters matching any target job description in seconds with Nextume AI. Multiple tones and lengths available.",
  keywords: [
    "AI Cover Letter Generator",
    "Cover Letter Builder",
    "Job Application Letter Generator",
    "AI Cover Letter Writer",
    "Nextume Cover Letter",
  ],
  alternates: {
    canonical: "https://nextume.in/cover-letter",
  },
  openGraph: {
    title: "AI Cover Letter Generator | Nextume.in",
    description: "Generate tailored cover letters matching job descriptions in seconds.",
    url: "https://nextume.in/cover-letter",
    images: ["/site-preview.png"],
  },
};

export default function CoverLetterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
