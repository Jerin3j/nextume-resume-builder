"use client";

import axiosInstance from "@/app/utils/axiosInstance";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, ArrowLeft, Sparkles, Loader2 } from "lucide-react";

export default function PublicPortfolio() {
  const params = useParams();
  const id = params?.id as string;

  const [html, setHtml] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setNotFound(false);

    axiosInstance
      .get(`/ai/portfolio/${id}`)
      .then((res) => {
        if (res.data?.html) {
          setHtml(res.data.html);
          setUsername(res.data.username || id);
          if (res.data.user?.name) {
            setUserName(res.data.user.name);
            document.title = `${res.data.user.name} | Portfolio - Nextume`;
          } else {
            document.title = `${res.data.username || id} | Portfolio - Nextume`;
          }
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load portfolio:", err);
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30 animate-pulse">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin absolute -top-1 -right-1" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold text-slate-200">Loading Portfolio...</h2>
            <p className="text-xs text-slate-500">{id}.nextume.in</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !html) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Globe className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Portfolio Not Found</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              The portfolio subdomain <span className="text-violet-400 font-semibold">{id}.nextume.in</span> has not been claimed or published yet.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <a
              href="https://nextume.in"
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim Your Free Subdomain on Nextume</span>
            </a>

            <Link
              href="/"
              className="w-full py-2.5 border border-slate-800 hover:bg-slate-800/60 text-slate-300 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <iframe
        srcDoc={html}
        title={`${username || id} - Portfolio`}
        className="w-full h-screen border-none fixed inset-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}