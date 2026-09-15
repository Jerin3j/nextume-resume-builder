"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  Eye,
  FileCheck,
  Globe,
  ArrowLeft,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import Footer from "@/components/home/Footer";

export default function PrivacyPolicyPage() {
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
            <Shield className="w-3.5 h-3.5 text-violet-600" />
            Security & Trust
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            At Nextume, your personal privacy and career information security are paramount. This policy outlines how we collect, handle, and safeguard your data.
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
              Information We Collect
            </h2>
            <p>
              When you use Nextume to build resumes, test ATS compatibility, generate cover letters, or publish developer portfolios, we collect the information you choose to provide:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>
                <strong className="text-slate-800">Account Information:</strong> Your name, email address, and encrypted credentials.
              </li>
              <li>
                <strong className="text-slate-800">Resume & Career Data:</strong> Work history, educational background, skills, certifications, and portfolio links.
              </li>
              <li>
                <strong className="text-slate-800">Uploaded Documents:</strong> PDF, DOC, and DOCX documents you upload for parsing and cover letter extraction.
              </li>
              <li>
                <strong className="text-slate-800">Payment Information:</strong> Transaction identifiers and payment status provided by our payment gateway (Razorpay). We do not store raw card numbers.
              </li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center font-extrabold">
                2
              </span>
              How We Use Your Data
            </h2>
            <p>We use the collected information strictly for legitimate operational purposes:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>To provide, maintain, and tailor resume profiles and ATS scoring feedback.</li>
              <li>To generate customized cover letters matching your career qualifications.</li>
              <li>To generate live online portfolio sites based on your technical achievements.</li>
              <li>To verify Pro plan purchases and manage user account access.</li>
              <li>To deliver critical account notices and customer support assistance.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center font-extrabold">
                3
              </span>
              AI Processing & Privacy Guarantees
            </h2>
            <p>
              Nextume utilizes modern AI models (OpenAI) to provide automated resume tailoring, ATS suggestions, and cover letter generation. We guarantee that:
            </p>
            <div className="bg-violet-50/50 border border-violet-100 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-slate-800">No Model Training on User Data:</strong> Your resumes, personal details, and generated letters are processed via private API endpoints and are not used to train public language models.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="text-slate-800">Direct Ownership:</strong> You retain complete intellectual property rights to all content and resumes created through Nextume.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center font-extrabold">
                4
              </span>
              Data Protection & Security
            </h2>
            <p>
              We implement industry-standard security protocols including HTTPS TLS encryption, cryptographic password hashing (bcrypt), and secure database controls to protect your data from unauthorized access or disclosure.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center font-extrabold">
                5
              </span>
              Your Rights (GDPR & CCPA)
            </h2>
            <p>You have full control over your data. At any time, you may:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>Access, modify, or export your saved resumes and cover letters.</li>
              <li>Request the permanent deletion of your account and all associated documents.</li>
              <li>Opt out of any marketing or non-essential communication.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center font-extrabold">
                6
              </span>
              Contact Us Regarding Privacy
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact our Data Protection Officer at:
            </p>
            <p className="font-semibold text-violet-600">
              <a href="mailto:privacy@nextume.com" className="hover:underline">
                privacy@nextume.com
              </a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
