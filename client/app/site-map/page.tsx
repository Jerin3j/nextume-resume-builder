import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  FileText,
  Activity,
  Sparkles,
  CreditCard,
  Users,
  Shield,
  FileCheck,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Home,
  Layers,
} from "lucide-react";
import Footer from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "HTML Sitemap & Domain Directory | Nextume.in",
  description:
    "Explore all pages, AI resume tools, ATS checkers, subdomain routes, and features available on Nextume.in. Complete site architecture and developer portfolio directory.",
  alternates: {
    canonical: "https://nextume.in/site-map",
  },
  openGraph: {
    title: "Nextume.in Sitemap & Directory",
    description: "Navigate all pages, features, and subdomains of Nextume AI Resume Builder.",
    url: "https://nextume.in/site-map",
    images: [
      {
        url: "/demo-img.png",
        width: 1200,
        height: 630,
        alt: "Nextume Demo Preview",
      },
    ],
  },
};

export default function SitemapPage() {
  const sections = [
    {
      title: "Core Subdomains & Navigation",
      icon: Globe,
      description: "Dedicated subdomains powering Nextume services",
      links: [
        {
          name: "Main Landing Page",
          path: "/",
          subdomain: "nextume.in",
          desc: "AI Resume Builder home, features overview, and interactive demos",
        },
        {
          name: "Dashboard & Builder App",
          path: "/dashboard",
          subdomain: "app.nextume.in",
          desc: "Manage resumes, edit sections in real-time, and download PDF",
        },
        {
          name: "ATS Resume Checker",
          path: "/ats-score",
          subdomain: "ats.nextume.in",
          desc: "Scan resumes for ATS compliance score and keyword analysis",
        },
        {
          name: "AI Cover Letter Generator",
          path: "/cover-letter",
          subdomain: "coverletter.nextume.in",
          desc: "Tailor personalized cover letters matching specific job descriptions",
        },
        {
          name: "Pro Pricing & Plans",
          path: "/pricing",
          subdomain: "pricing.nextume.in",
          desc: "Compare Free and Pro plan features with instant unlock",
        },
        {
          name: "User Portfolio Websites",
          path: "/portfolio/demo",
          subdomain: "{username}.nextume.in",
          desc: "Dynamic developer portfolio websites hosted on personal subdomains",
        },
      ],
    },
    {
      title: "AI Tools & Features",
      icon: Sparkles,
      description: "Smart features designed for modern job seekers",
      links: [
        {
          name: "Real-time AI Summary Enhancer",
          path: "/dashboard",
          subdomain: "nextume.in/dashboard",
          desc: "Generate punchy, recruiter-grade professional summaries in seconds",
        },
        {
          name: "Experience & Job Bullet Rewriter",
          path: "/dashboard",
          subdomain: "nextume.in/dashboard",
          desc: "Transform responsibilities into impactful, metric-driven achievements",
        },
        {
          name: "Project Impact Enhancer",
          path: "/dashboard",
          subdomain: "nextume.in/dashboard",
          desc: "Highlight tech stacks and engineering solutions effectively",
        },
        {
          name: "One-Click Subdomain Portfolio Generator",
          path: "/dashboard",
          subdomain: "nextume.in/dashboard",
          desc: "Turn your resume JSON into a responsive personal website",
        },
      ],
    },
    {
      title: "Resources & Community",
      icon: Users,
      description: "Community support, guides, and career resources",
      links: [
        {
          name: "Nextume Community",
          path: "/community",
          subdomain: "community.nextume.in",
          desc: "Connect with developers, share resumes, and give feedback",
        },
        {
          name: "Help & Support",
          path: "/support",
          subdomain: "nextume.in/support",
          desc: "Frequently asked questions, troubleshooting, and contact",
        },
      ],
    },
    {
      title: "Legal & Transparency",
      icon: Shield,
      description: "Privacy terms, data security, and platform guidelines",
      links: [
        {
          name: "Privacy Policy",
          path: "/privacy",
          subdomain: "nextume.in/privacy",
          desc: "How your resume data, passwords, and tokens are protected",
        },
        {
          name: "Terms & Conditions",
          path: "/terms",
          subdomain: "nextume.in/terms",
          desc: "Usage terms, subscription details, and refund guidelines",
        },
      ],
    },
  ];

  // Schema.org structured data for sitemap
  const sitemapSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nextume Site Map",
    description: "Complete list of URLs and subdomains on Nextume.in",
    numberOfItems: sections.reduce((acc, s) => acc + s.links.length, 0),
    itemListElement: sections.flatMap((section, sIndex) =>
      section.links.map((link, lIndex) => ({
        "@type": "ListItem",
        position: sIndex * 10 + lIndex + 1,
        name: link.name,
        url: `https://nextume.in${link.path}`,
      }))
    ),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* JSON-LD for Search Engine Indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sitemapSchema) }}
      />

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg
              width="140"
              height="34"
              viewBox="0 0 157 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="0"
                y="28"
                fontFamily="Arial, sans-serif"
                fontSize="28"
                fill="#020618"
                fontWeight="600"
              >
                nextume<tspan fill="#4F39F6">.</tspan>
              </text>
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-violet-600 transition flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              Launch App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12 flex-1 w-full">
        {/* Page Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-800 text-xs font-bold rounded-full">
            <Layers className="w-3.5 h-3.5" />
            <span>Client-Side Sitemap & Subdomain Index</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Nextume.in Site Architecture
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Direct access to all public pages, AI resume builder tools, ATS compatibility scanner,
            and personal subdomain portfolio hosting endpoints.
          </p>
        </div>

        {/* Site Preview & Demo Image Showcase Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Demo Preview</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Next-Gen AI Resume & Subdomain Portfolio Platform
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Empowering candidates worldwide with 95%+ ATS-compatible resumes and personal developer portfolios hosted directly on custom handles like <span className="text-violet-400 font-mono font-semibold">jerin.nextume.in</span>.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/ats-score"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-violet-900/40"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Check ATS Score</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Build Resume</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative group rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
                <img
                  src="/demo-img.png"
                  alt="Nextume.in AI Resume Builder and Subdomain Portfolio Demo Preview"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs font-semibold text-white flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-violet-400" />
                    <span>Nextume.in Interactive Mockup Preview</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, idx) => {
            const SectionIcon = section.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 hover:border-violet-300 transition-colors"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                    <SectionIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800">{section.title}</h3>
                    <p className="text-[11px] text-slate-400">{section.description}</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {section.links.map((link, lIdx) => (
                    <Link
                      key={lIdx}
                      href={link.path}
                      className="group flex items-start justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                    >
                      <div className="space-y-0.5 pr-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-700 group-hover:text-violet-600 transition-colors">
                            {link.name}
                          </h4>
                          <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 group-hover:bg-violet-100 group-hover:text-violet-700 px-1.5 py-0.5 rounded transition-colors">
                            {link.subdomain}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">{link.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* XML & Crawler Badges */}
        <div className="bg-slate-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Live XML Sitemap available for search bots:</span>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-violet-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>/sitemap.xml</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span>Robots.txt:</span>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-violet-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>/robots.txt</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
