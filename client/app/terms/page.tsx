"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CreditCard,
  Sparkles,
} from "lucide-react";
import Footer from "@/components/home/Footer";

export default function TermsAndConditionsPage() {
  const lastUpdated = "August 20, 2025";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans">
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            Last Updated: {lastUpdated}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 flex-1">
        {/* Header Title */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs uppercase font-bold tracking-wider text-violet-600">
            <Scale className="w-3.5 h-3.5 text-violet-600" />
            Legal Agreement
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Terms & Conditions
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before accessing or using Nextume's resume building, ATS checking, and cover letter generation platform.
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm space-y-8 text-xs md:text-sm text-slate-600 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center font-extrabold">
                1
              </span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing or creating an account on Nextume ("Platform", "we", "us", or "our"), you agree to be bound by these Terms & Conditions. If you disagree with any part of these terms, you may not access the Platform or utilize its services.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center font-extrabold">
                2
              </span>
              User Accounts & Security
            </h2>
            <p>
              When creating an account, you must provide accurate, complete, and updated information. You are responsible for safeguarding your login credentials and password. Nextume will not be liable for any losses caused by unauthorized use of your account.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center font-extrabold">
                3
              </span>
              User Content Ownership & AI Output
            </h2>
            <p>
              You retain all ownership rights and intellectual property in the resumes, text, work history, and portfolio documents you create or upload on Nextume.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <p className="font-semibold text-slate-800">Regarding AI-Generated Content:</p>
              <p className="text-slate-600">
                You are granted a worldwide, irrevocable license to use, download, modify, distribute, and publish any resume text, cover letter, or portfolio code generated through our AI features for your personal and professional job hunting needs.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center font-extrabold">
                4
              </span>
              Pro Plan Subscriptions & Lifetime Access
            </h2>
            <p>
              Nextume offers a Pro tier upgrade for a one-time fee of ₹99. Purchasing Nextume Pro grants lifetime access to enhanced features including:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>Unlimited resume profile creation and downloads.</li>
              <li>Multiple cover letter generations per resume with custom tone and length options.</li>
              <li>Direct code inspection and export for generated developer portfolios.</li>
              <li>Tailoring against targeted job descriptions.</li>
            </ul>
            <p className="text-slate-500 text-xs pt-1">
              Payments are processed securely through Razorpay. Due to the immediate delivery of digital credits and lifetime features, all sales are final except where required by applicable consumer law.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center font-extrabold">
                5
              </span>
              Prohibited Conduct
            </h2>
            <p>You agree not to engage in any of the following prohibited activities:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>Reverse engineering, scraping, or launching automated attacks against the Platform.</li>
              <li>Generating fraudulent, defamatory, or unlawful documents.</li>
              <li>Attempting to bypass Free/Pro tier limits or unauthorized API access.</li>
              <li>Sharing or reselling account credentials with third parties.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center font-extrabold">
                6
              </span>
              Disclaimer & Limitation of Liability
            </h2>
            <p>
              Nextume provides tools to optimize resumes and simulate ATS scores. However, we do not guarantee interview offers, hiring outcomes, or employment results. The platform is provided "as is" and "as available" without warranties of any kind.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center font-extrabold">
                7
              </span>
              Questions & Contact Information
            </h2>
            <p>
              For legal notices, billing inquiries, or questions about these Terms & Conditions, please contact us at:
            </p>
            <p className="font-semibold text-violet-600">
              <a href="mailto:legal@nextume.com" className="hover:underline">
                legal@nextume.com
              </a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
