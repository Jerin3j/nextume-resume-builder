import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Cover Letter Generator & Creator | Nextume",
    description: "Generate a premium, tailored cover letter matching your resume and target job description using AI. Get an ATS-friendly cover letter in seconds.",
    keywords: [
        "AI Cover Letter Generator",
        "Resume Builder",
        "Cover Letter Creator",
        "ATS-friendly Cover Letters",
        "Job Applications",
        "Nextume",
    ],
    alternates: {
        canonical: "https://nextume.app/cover-letter",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "AI Cover Letter Generator & Creator | Nextume",
        description: "Generate a premium, tailored cover letter matching your resume and target job description using AI. Get an ATS-friendly cover letter in seconds.",
        url: "https://nextume.app/cover-letter",
        siteName: "Nextume",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Cover Letter Generator & Creator | Nextume",
        description: "Generate a premium, tailored cover letter matching your resume and target job description using AI.",
    },
};

export default function CoverLetterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
