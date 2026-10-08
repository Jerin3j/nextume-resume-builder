import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Community & Job Seekers Network | Nextume.in",
  description:
    "Join the Nextume Community. Connect with job seekers, frontend engineers, recruiters, and career mentors to review resumes and share feedback.",
  alternates: {
    canonical: "https://nextume.in/community",
  },
  openGraph: {
    title: "Nextume.in Developer Community",
    description: "Connect with developers, share resumes, and grow your career with Nextume.",
    url: "https://nextume.in/community",
    images: ["/site-preview.png"],
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
