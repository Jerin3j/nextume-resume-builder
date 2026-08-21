"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  Users,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Share2,
  Heart,
  TrendingUp,
  Award,
  Globe,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Send,
  CheckCircle2,
} from "lucide-react";
import Footer from "@/components/home/Footer";

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.authReducer);

  const stats = [
    { label: "Community Members", value: "25,000+" },
    { label: "Resumes Tailored", value: "120,000+" },
    { label: "Jobs Landed", value: "18,500+" },
    { label: "Interview Rate Boost", value: "3.4x" },
  ];

  const discussionChannels = [
    {
      title: "Resume & Portfolio Reviews",
      desc: "Get feedback on your resume structure, ATS score, and developer portfolio from senior industry recruiters.",
      members: "8.4k members",
      badge: "Most Active",
      icon: Award,
    },
    {
      title: "ATS Hacks & Industry Insights",
      desc: "Learn modern parsing techniques, keyword optimization, and real company interview experiences.",
      members: "12.1k members",
      badge: "Trending",
      icon: TrendingUp,
    },
    {
      title: "Career & Interview Prep",
      desc: "Practice behavioral and technical interview questions with peers and share salary negotiation tips.",
      members: "6.7k members",
      badge: "Popular",
      icon: MessageSquare,
    },
    {
      title: "Feature Requests & Beta Testing",
      desc: "Directly influence Nextume's development roadmap and try upcoming AI tools before public release.",
      members: "4.2k members",
      badge: "Product Team",
      icon: Sparkles,
    },
  ];

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Frontend Engineer at Vercel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      content:
        "The Nextume community feedback on my resume helped me boost my ATS score from 62 to 94. Within two weeks, I had three FAANG interview requests!",
    },
    {
      name: "Priya Sharma",
      role: "Product Designer at Stripe",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      content:
        "Collaborating with the career coaches and designers in the Nextume Discord community made portfolio building so much simpler.",
    },
    {
      name: "Marcus Vance",
      role: "Full Stack Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      content:
        "The cover letter generator combined with advice from this community completely revolutionized my job hunt strategy.",
    },
  ];

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
            {user ? (
              <Link
                href="/dashboard"
                className="text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16 flex-1">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs uppercase font-bold tracking-wider text-violet-600">
            <Users className="w-4 h-4 text-violet-600" />
            Nextume Global Community
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Connect, Learn, and Level Up Your Career
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Join thousands of job seekers, developers, recruiters, and career coaches sharing ATS optimization tips, resume feedback, and hiring opportunities.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Join Discord Community
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Linkedin className="w-4 h-4 text-[#0A66C2]" />
              Follow on LinkedIn
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-sm hover:border-violet-300 transition-all"
            >
              <p className="text-2xl md:text-3xl font-extrabold text-violet-600">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Channels / Categories */}
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Explore Discussion Hubs
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Targeted forums and chat rooms tailored to every stage of your career journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discussionChannels.map((channel, idx) => {
              const Icon = channel.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-violet-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {channel.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-800">{channel.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{channel.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 font-medium">{channel.members}</span>
                    <a
                      href="https://discord.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 font-bold hover:text-violet-700 flex items-center gap-1"
                    >
                      Join Discussion <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member Testimonials */}
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Community Success Stories
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Hear from professionals who accelerated their job search with Nextume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-violet-200 transition-all"
              >
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{t.name}</h4>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Guidelines CTA */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-3xl p-8 md:p-12 text-center max-w-5xl mx-auto shadow-md space-y-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">Ready to share your journey?</h3>
          <p className="text-xs md:text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Our community is welcoming, respectful, and committed to helping every member succeed. Follow the guidelines and start participating today.
          </p>
          <div className="pt-2">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-700 hover:bg-violet-50 font-bold text-xs rounded-xl shadow transition-all"
            >
              <Send className="w-4 h-4 text-violet-600" />
              Join the Conversation
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
