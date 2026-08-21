"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  HelpCircle,
  Search,
  MessageSquare,
  Mail,
  FileText,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Send,
  LifeBuoy,
} from "lucide-react";
import toast from "react-hot-toast";
import Footer from "@/components/home/Footer";

export default function SupportPage() {
  const { user } = useSelector((state: RootState) => state.authReducer);
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Contact form state
  const [formName, setFormName] = useState(user?.name || "");
  const [formEmail, setFormEmail] = useState(user?.email || "");
  const [formSubject, setFormSubject] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "All",
    "Resume Builder",
    "ATS Checker",
    "Cover Letters",
    "Portfolios",
    "Billing & Pro",
  ];

  const faqs = [
    {
      category: "Resume Builder",
      question: "How does the AI Resume Tailoring work?",
      answer:
        "Nextume uses advanced language models to evaluate your past experience against industry standards. It suggests impactful bullet points, quantifiable metrics, and optimal formatting to ensure high ATS compatibility.",
    },
    {
      category: "ATS Checker",
      question: "What is an ATS score and how is it calculated?",
      answer:
        "Applicant Tracking Systems (ATS) scan resumes for relevant keywords, section headings, clean formatting, and legible fonts. Our ATS Checker simulates these algorithms to score your resume on a 0-100 scale with specific actionable improvements.",
    },
    {
      category: "Cover Letters",
      question: "Can I generate cover letters without entering job details?",
      answer:
        "Yes! Entering company name and job details is optional. If you leave them blank, our AI automatically crafts a versatile, professional cover letter based entirely on your resume's core strengths.",
    },
    {
      category: "Cover Letters",
      question: "How many cover letters can I upload externally?",
      answer:
        "Nextume supports unlimited external uploads of PDF, DOC, and DOCX cover letters for both Free and Pro plan users. These uploads do not count toward your AI generation limit.",
    },
    {
      category: "Portfolios",
      question: "Can I download and customize my portfolio website code?",
      answer:
        "Yes! Pro users can inspect the generated HTML codebase, customize styles, and host the portfolio on custom domains or popular static hosting services.",
    },
    {
      category: "Billing & Pro",
      question: "Is the Pro Plan a monthly subscription or a one-time purchase?",
      answer:
        "Nextume Pro is a one-time lifetime payment of ₹99. You will never be charged recurring fees or hidden subscription renewals.",
    },
    {
      category: "Billing & Pro",
      question: "What payment methods are supported?",
      answer:
        "We support all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, Net Banking, and digital wallets securely processed through Razorpay.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Your message has been sent! Our support team will get back to you within 24 hours.");
      setFormSubject("");
      setFormMessage("");
    }, 1000);
  };

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

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16 flex-1">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs uppercase font-bold tracking-wider text-violet-600">
            <LifeBuoy className="w-4 h-4 text-violet-600" />
            Help & Support Center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            How can we help you today?
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Find answers to frequently asked questions, learn how to get the most out of Nextume, or reach out to our dedicated support staff.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto pt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-0.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search help articles, ATS guides, billing questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none text-sm"
            />
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3 hover:border-violet-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Email Support</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Send us an email anytime and our team will get back to you within 24 hours.
            </p>
            <a
              href="mailto:support@nextume.com"
              className="inline-block text-xs font-bold text-violet-600 hover:text-violet-700 pt-1"
            >
              support@nextume.com &rarr;
            </a>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3 hover:border-violet-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Community Chat</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Join active discussions with power users, resume builders, and team members.
            </p>
            <Link
              href="/community"
              className="inline-block text-xs font-bold text-violet-600 hover:text-violet-700 pt-1"
            >
              Visit Community &rarr;
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3 hover:border-violet-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Privacy & Billing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Learn about our enterprise-grade data security and transparent one-time pricing.
            </p>
            <Link
              href="/pricing"
              className="inline-block text-xs font-bold text-violet-600 hover:text-violet-700 pt-1"
            >
              View Pricing &rarr;
            </Link>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Quick answers to the most common questions about Nextume features and billing.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedCategory === cat
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3 pt-2">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No matching questions found for "{searchTerm}". Please reach out to us directly!
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-5 text-left font-bold text-sm text-slate-800 flex items-center justify-between gap-4 cursor-pointer hover:text-violet-600 transition-colors"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-violet-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Contact Support Form */}
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">Still have questions?</h3>
            <p className="text-xs text-slate-500">
              Send our engineering and career support team a direct inquiry.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:bg-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Subject
              </label>
              <input
                type="text"
                placeholder="Question about ATS scoring, cover letter, or billing"
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:bg-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Message *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Describe what you need assistance with..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:bg-white outline-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Sending Message...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
