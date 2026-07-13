import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Free Online ATS Resume Score Checker | Nextume",
    description: "Scan and check your resume compatibility with Applicant Tracking Systems (ATS) online using AI. Get detailed structural feedback, keyword matches, and improvement tips.",
    keywords: [
        "ATS score check online",
        "resume scanner online",
        "ATS resume checker",
        "free ats checker",
        "check ats score",
        "Nextume",
    ],
};
export default function AtsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
