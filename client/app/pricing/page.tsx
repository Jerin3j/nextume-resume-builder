"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/redux/store";
import { setUser } from "@/lib/redux/authSlice";
import {
  Check,
  ShieldAlert,
  Sparkles,
  Zap,
  Globe,
  FileText,
  Code2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Crown,
} from "lucide-react";
import axiosInstance from "@/app/utils/axiosInstance";
import toast from "react-hot-toast";

// Script loader helper for Razorpay
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PricingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please log in or register to upgrade to Pro.");
      router.push("/login?redirect=/pricing");
      return;
    }

    if (user.isPro) {
      toast.success("You are already on the Pro tier!");
      return;
    }

    setUpgrading(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error("Failed to load Razorpay SDK. Check your internet connection.");
        setUpgrading(false);
        return;
      }

      // Create Razorpay Order in Backend
      const { data } = await axiosInstance.post("/payment/create-order");

      if (!data.success) {
        throw new Error(data.message || "Failed to initiate payment");
      }

      const { order, keyId } = data;

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Nextume Pro Plan",
        description: "Lifetime access to Pro features",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            setUpgrading(true);
            const verifyRes = await axiosInstance.post("/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success("Upgrade to Pro Successful! 🚀");

              // Refetch user profile details
              const profileRes = await axiosInstance.get("/users/me");
              dispatch(setUser(profileRes.data.user));

              router.push("/dashboard");
            } else {
              toast.error(verifyRes.data.message || "Signature verification failed.");
            }
          } catch (verifyErr: any) {
            console.error(verifyErr);
            toast.error(verifyErr.response?.data?.message || "Verification failed");
          } finally {
            setUpgrading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#4F39F6",
        },
        modal: {
          ondismiss: function () {
            setUpgrading(false);
            toast("Payment window closed.", { icon: "ℹ️" });
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Payment initiation failed");
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between py-12 px-4 relative overflow-hidden font-sans">
      {/* Background radial overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto w-full space-y-12 relative z-10">
        {/* Top bar back button */}
        <button
          onClick={() => router.push(user ? "/dashboard" : "/")}
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {user ? "Dashboard" : "Home"}
        </button>

        {/* Heading description */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-[10px] uppercase font-bold tracking-wider text-violet-600">
            <Sparkles className="w-3.5 h-3.5 fill-violet-200" />
            Simple Transparent Pricing
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Choose the Perfect Plan
          </h1>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed">
            Build resume profiles, check your ATS score, customize online developer portfolios, and generate tailored cover letters in minutes.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto pt-6">
          
          {/* FREE PLAN */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-slate-300 transition-all hover:translate-y-[-2px] relative shadow-sm">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Basic Tier
                </span>
                <h3 className="text-2xl font-extrabold text-slate-800">Free Plan</h3>
              </div>

              <div className="flex items-baseline gap-1 text-slate-950">
                <span className="text-4xl font-black">₹0</span>
                <span className="text-xs text-slate-400 font-semibold">/ lifetime</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Standard features for personal job hunting. Build resumes, check ATS compatibility, and generate cover letters.
              </p>

              <hr className="border-slate-100" />

              {/* Free Features list */}
              <ul className="space-y-4 text-xs text-slate-600">
                <li className="flex items-center gap-3">
                  <div className="flex-none p-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Create up to <b>5 Resumes</b> in total</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex-none p-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><b>1 Portfolio website</b> generation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex-none p-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Standard ATS Score Checking access</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex-none p-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Generate up to <b>2 Cover Letters</b> (1 per resume)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <div className="flex-none p-0.5 bg-slate-100 text-slate-400 rounded-full border border-slate-200">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span>Professional tone & Medium length only</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <div className="flex-none p-0.5 bg-slate-100 text-slate-400 rounded-full border border-slate-200">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span>No Job Description personalization tailoring</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <div className="flex-none p-0.5 bg-slate-100 text-slate-400 rounded-full border border-slate-200">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span>No Portfolio website code editing</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                if (user) {
                  router.push("/dashboard");
                } else {
                  router.push("/login");
                }
              }}
              className="w-full mt-8 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>{user ? "Back to Dashboard" : "Start Free"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="bg-white border-2 border-violet-600 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-violet-500 transition-all hover:translate-y-[-2px] relative shadow-lg shadow-violet-100">
            {/* Crown Pro badge */}
            <div className="absolute top-0 right-6 translate-y-[-50%] bg-violet-600 text-white text-[10px] font-black tracking-widest uppercase py-1 px-3.5 rounded-full flex items-center gap-1 shadow-md shadow-violet-200">
              <Crown className="w-3 h-3 text-white" />
              Most Popular
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs text-violet-600 font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-violet-600 fill-violet-600" />
                  Premium Tier
                </span>
                <h3 className="text-2xl font-extrabold text-slate-800">Pro Plan</h3>
              </div>

              <div className="flex items-baseline gap-1 text-slate-950">
                <span className="text-4xl font-black">₹99</span>
                <span className="text-xs text-slate-500 font-semibold">/ one-time payment</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Unlock full portfolio flexibility, edit code directly, customize cover letters, and build unlimited documents.
              </p>

              <hr className="border-slate-100" />

              {/* Pro Features list */}
              <ul className="space-y-4 text-xs text-slate-600">
                <li className="flex items-center gap-3">
                  <div className="flex-none p-0.5 bg-violet-50 text-violet-600 rounded-full border border-violet-100">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><b>Unlimited Resumes</b> creation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex-none p-0.5 bg-violet-50 text-violet-600 rounded-full border border-violet-100">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Up to <b>3 Portfolio website regenerations</b></span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex-none p-0.5 bg-violet-50 text-violet-600 rounded-full border border-violet-100">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Get & <b>edit custom HTML codebase</b> of portfolio</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex-none p-0.5 bg-violet-50 text-violet-600 rounded-full border border-violet-100">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Generate up to <b>3 Cover Letters per resume</b></span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex-none p-0.5 bg-violet-50 text-violet-600 rounded-full border border-violet-100">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><b>Unlock all AI Option customization</b> (6 tones, 3 depths)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex-none p-0.5 bg-violet-50 text-violet-600 rounded-full border border-violet-100">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span><b>Tailor precisely</b> using pasted Job Descriptions</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex-none p-0.5 bg-violet-50 text-violet-600 rounded-full border border-violet-100">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Priority AI description optimization speed</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={upgrading || !!user?.isPro}
              className="w-full mt-8 py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-violet-200 active:scale-[0.99]"
            >
              {upgrading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : user && user?.isPro ? (
                <span>Active Pro User</span>
              ) : (
                <>
                  <span>Upgrade to Pro Now</span>
                  <Zap className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-slate-400 text-[10px] mt-12">
        <p>© 2025 Nextume. Payments processed securely via Razorpay.</p>
      </div>
    </div>
  );
}
