import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI ATS Resume Checker & Compatibility Score | Nextume.in",
  description:
    "Scan your resume for free with Nextume AI ATS Checker. Get a 0-100 ATS score, find missing keywords, check formatting readability, and optimize your resume to pass company recruiter filters.",
  keywords: [
    "ATS Resume Checker",
    "ATS Score Scanner",
    "Free Resume Reviewer",
    "Applicant Tracking System Test",
    "ATS Friendly Resume Test",
    "Resume Keyword Matcher",
    "Nextume ATS Score",
  ],
  alternates: {
    canonical: "https://nextume.in/ats-score",
  },
  openGraph: {
    title: "Free AI ATS Resume Checker | Nextume.in",
    description: "Scan your resume against ATS algorithms and get an instant score and improvement guide.",
    url: "https://nextume.in/ats-score",
    images: ["/site-preview.png"],
  },
};

export default function AtsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
