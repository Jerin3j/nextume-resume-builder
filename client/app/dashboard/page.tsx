"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setUser } from "@/lib/redux/authSlice";
import {
  FileText,
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  ShieldCheckIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
  Globe,
  ArrowUpRight,
  Calendar,
  Activity,
  Link as LinkIcon,
  Share2,
  Copy,
  ExternalLink,
  Code2,
  Crown,
  Lock,
  Sparkles,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import Link from "next/link";

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);

  const [showHtmlEditorModal, setShowHtmlEditorModal] = useState<boolean>(false);
  const [editedHtml, setEditedHtml] = useState<string>("");
  const [isSavingHtml, setIsSavingHtml] = useState<boolean>(false);
  const [editorTab, setEditorTab] = useState<"code" | "preview">("code");

  const handleOpenHtmlEditor = () => {
    setEditedHtml(user?.portfolio?.html || "");
    setEditorTab("code");
    setShowHtmlEditorModal(true);
  };

  const handleSaveHtml = async () => {
    setIsSavingHtml(true);
    try {
      const { data } = await axiosInstance.put("/ai/portfolio/edit", {
        html: editedHtml,
      });
      toast.success(data.message || "Portfolio codebase updated!");

      // Update redux state with latest html
      const profileRes = await axiosInstance.get("/users/me");
      dispatch(setUser(profileRes.data.user));

      setShowHtmlEditorModal(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update HTML codebase");
    } finally {
      setIsSavingHtml(false);
    }
  };

  const [allResumes, setAllResumes] = useState<any[]>([]);
  const [showCreatedResume, setShowCreatedResume] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showUploadResume, setShowUploadResume] = useState<boolean>(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [resume, setResume] = useState<any>();
  const [editResumeId, setEditResumeId] = useState<string | null>(null);
  const [portfolioId, setPortfolioId] = useState("");
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false);
  const [selectedPortfolioResumeId, setSelectedPortfolioResumeId] = useState<
    number | null
  >(null);

  // Single active portfolio resume ID (Stored client-side in localStorage)
  const [activePortfolioId, setActivePortfolioId] = useState<number | null>(
    null,
  );

  // Load all resumes and active portfolio configuration
  useEffect(() => {
    const loadAllResumes = async () => {
      try {
        const resumes = await axiosInstance.get("/users/resumes");
        setAllResumes(resumes.data.resumes || []);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load resumes");
      }
    };
    loadAllResumes();

    if (typeof window !== "undefined") {
      const savedPortfolioId = localStorage.getItem("activePortfolioResumeId");
      if (savedPortfolioId) {
        setActivePortfolioId(Number(savedPortfolioId));
      }
    }
  }, []);

  const handleUploadClick = () => {
    toast("Profile photos won’t be imported. You can add one later.", {
      icon: "ℹ️",
      position: "top-right",
      duration: 6000,
    });
    setShowUploadResume(true);
  };

  // Create new resume handler
  const createResume = async (event: any) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      const { data } = await axiosInstance.post("/resumes/create", { title });
      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreatedResume(false);
      router.push(`/dashboard/builder/${data.resume?.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Upload resume handler
  const uploadResume = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await axiosInstance.post("/resumes/upload-resume", {
        title,
        resumeText,
      });
      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      router.push(`/dashboard/builder/${data?.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit resume title handler
  const editResumeTitle = async (event: any) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      const { data } = await axiosInstance.put("/resumes/update", {
        id: editResumeId,
        resumeData: { title },
      });

      setAllResumes(
        allResumes.map((res) =>
          res.id === Number(editResumeId) ? { ...res, title } : res,
        ),
      );
      setTitle("");
      setEditResumeId(null);
      toast.success(data.message || "Resume renamed!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete resume handler
  const deleteResume = async (resumeId: number, resumeTitle: string) => {
    toast(
      (t) => (
        <span className="flex flex-col gap-2">
          Are you sure you want to delete "{resumeTitle}"?
          <div className="flex gap-2 mt-1">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              onClick={async () => {
                try {
                  const { data } = await axiosInstance.delete(
                    `/resumes/delete/${resumeId}`,
                  );
                  setAllResumes(
                    allResumes.filter((res) => res.id !== resumeId),
                  );

                  // If the deleted resume was the portfolio, clear it
                  if (activePortfolioId === resumeId) {
                    setActivePortfolioId(null);
                    localStorage.removeItem("activePortfolioResumeId");
                  }

                  toast.dismiss(t.id);
                  toast.success(data.message || "Deleted successfully!");
                } catch (error: any) {
                  toast.error(
                    error?.response?.data?.message || "Failed to delete resume",
                  );
                }
              }}
            >
              Delete
            </button>
            <button
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </span>
      ),
      { duration: 6000 },
    );
  };

  // Toggle resume sharing link availability (public / private status)
  const toggleShareStatus = async (
    resumeId: number,
    currentPublicStatus: boolean,
  ) => {
    try {
      const { data } = await axiosInstance.put("/resumes/update", {
        id: resumeId,
        resumeData: { public: !currentPublicStatus },
      });

      setAllResumes(
        allResumes.map((res) =>
          res.id === resumeId ? { ...res, public: !currentPublicStatus } : res,
        ),
      );

      toast.success(
        !currentPublicStatus
          ? "Resume sharing link activated!"
          : "Sharing disabled.",
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update sharing status",
      );
    }
  };

  // Copy share link helper
  const copyShareLink = (resumeId: number) => {
    const shareUrl = `${window.location.origin}/view/${resumeId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard!");
  };

  // Set active single portfolio handler
  const handleGeneratePortfolio = async () => {
    if (!selectedPortfolioResumeId) {
      toast.error("Please select a resume first");
      return;
    }
    try {
      setIsGeneratingPortfolio(true);
      const selectedResume = allResumes.find(
        (resume) => resume.id === selectedPortfolioResumeId,
      );

      if (!selectedResume) {
        toast.error("Resume not found");
        return;
      }
      // Send resumeId only
      const { data } = await axiosInstance.post("/ai/generate-portfolio", {
        resumeId: selectedPortfolioResumeId,
        username: selectedResume?.title,
      });

      setPortfolioId(data.portfolioId);

      setActivePortfolioId(selectedPortfolioResumeId);

      localStorage.setItem(
        "activePortfolioResumeId",
        selectedPortfolioResumeId.toString(),
      );

      toast.success("Portfolio generated successfully 🚀");

      setShowPortfolioModal(false);
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed generating portfolio",
      );
    } finally {
      setIsGeneratingPortfolio(false);
    }
  };

  const totalResumes = allResumes.length;
  // Find linked resume for portfolio details
  const activePortfolioResume = allResumes.find(
    (res) => res.id === activePortfolioId,
  );


  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Main Brand-Accented Greeting Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 text-white p-6 md:p-8 shadow-md">
          <div className="relative z-10 space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || "User"}!
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed max-w-xl">
              Create professional resumes, scan them for ATS compatibility, and
              deploy your personal portfolio website.
            </p>
          </div>
          {/* Subtle logo texture background decoration */}
          <div className="absolute right-6 bottom-0 top-0 w-24 opacity-10 flex items-center justify-center pointer-events-none text-white select-none">
            <span className="text-9xl font-black">N</span>
          </div>
        </div>

        {/* Dynamic Multi-Section Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Portfolio Panel Widget (Left, wide) */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Globe className="w-4.5 h-4.5 text-violet-600" />
                Personal Portfolio Website
              </h2>
              <p className="text-xs text-slate-400">
                You can host exactly one portfolio page based on one active
                resume document.
              </p>
            </div>
            {/* Preview of current portfolio */}
            {user?.portfolio?.html && (
              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                <iframe
                  srcDoc={user?.portfolio?.html}
                  title="Portfolio Preview"
                  className="origin-top-left border-0"
                  style={{
                    width: "200%",
                    height: "200%",
                    transform: "scale(0.5)",
                  }}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            )}

            {activePortfolioResume ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-block text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Live website
                    </span>
                    <h3 className="font-bold text-sm text-slate-700">
                      {activePortfolioResume.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Template: {activePortfolioResume.template} • Updated{" "}
                    {new Date(
                      activePortfolioResume.updatedAt,
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={`portfolio/${portfolioId || user?.portfolio?.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-violet-100"
                  >
                    <span>View Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      if (!user?.isPro) {
                        toast.error("Upgrade to Pro to regenerate your portfolio website.");
                        return;
                      }
                      if (user?.portfolio && user.portfolio.regenCount >= 3) {
                        toast.error("You have reached the maximum limit of 3 portfolio regenerations.");
                        return;
                      }
                      setSelectedPortfolioResumeId(activePortfolioId);
                      setShowPortfolioModal(true);
                    }}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${user?.isPro && !(user.portfolio && user.portfolio.regenCount >= 3)
                      ? "border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-100"
                      : "border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed"
                      }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {user?.isPro
                        ? `Regenerate (${3 - (user.portfolio?.regenCount || 0)} left)`
                        : "Regenerate (Locked)"}
                    </span>
                    {!user?.isPro && <Lock className="w-3 h-3 text-slate-400" />}
                  </button>

                  <button
                    onClick={() => {
                      if (!user?.isPro) {
                        toast.error("Upgrade to Pro to edit your portfolio codebase!");
                        return;
                      }
                      handleOpenHtmlEditor();
                    }}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${user?.isPro
                      ? "border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-100"
                      : "border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed"
                      }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Edit Code</span>
                    {!user?.isPro && <Lock className="w-3 h-3 text-slate-400" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl space-y-3">
                <p className="text-xs text-slate-400">
                  No active portfolio website linked to your account.
                </p>
                <button
                  onClick={() => {
                    if (allResumes.length === 0) {
                      toast.error("Please create a resume first.");
                      return;
                    }
                    setShowPortfolioModal(true);
                  }}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm shadow-violet-100"
                >
                  Link Portfolio Resume
                </button>
              </div>
            )}
          </div>

          {/* Quick Metrics & Actions column (Right, narrow) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between space-y-4">
            <h2 className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Control Actions
            </h2>

            <div className="space-y-2">
              {/* SaaS Subscription Info Box */}
              {!user?.isPro ? (
                <div className="min-h-[155px] flex flex-col justify-between bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl p-4 text-white relative overflow-hidden shadow-md">
                  <div className="absolute right-0 bottom-0 translate-x-[20%] translate-y-[20%] opacity-15">
                    <Crown className="w-20 h-20 text-white" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-xs flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      Upgrade to Pro
                    </h3>

                    <p className="text-[10px] text-indigo-100">
                      Create unlimited resumes, edit portfolio HTML codebase, and regenerate portfolio.
                    </p>
                  </div>

                  <button
                    onClick={() => router.push("/pricing")}
                    className="w-full py-1.5 bg-white hover:bg-slate-50 text-indigo-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Upgrade for ₹99
                  </button>
                </div>
              ) : (
                <div className="relative min-h-[155px] overflow-hidden rounded-xl border border-violet-200 bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-indigo-500/10 p-4">

                  {/* Background Crown */}
                  <div className="absolute -right-4 -bottom-6 opacity-10">
                    <Crown className="h-24 w-24 text-violet-700" />
                  </div>

                  {/* Small Glow */}
                  <div className="absolute -top-8 -left-8 h-20 w-20 rounded-full bg-violet-400/15 blur-2xl" />

                  <div className="relative flex h-full flex-col justify-between">

                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-md">
                          <Crown className="h-5 w-5 fill-amber-300 text-amber-300" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-800">
                            Pro Plan Active
                          </h3>

                          <p className="text-xs text-violet-600">
                            Premium membership enabled
                          </p>
                        </div>
                      </div>

                      <p className="mt-2 text-[10px] leading-5 text-slate-600">
                        Enjoy unlimited resumes, ATS analysis, portfolio customization, and all future Pro features.
                      </p>
                    </div>

                    <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 pt-1 text-xs font-medium text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active Membership
                    </div>

                  </div>
                </div>
              )}

              <button
                onClick={() => setShowCreatedResume(true)}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-violet-100"
              >
                <PlusIcon className="w-4 h-4" />
                Create New Resume
              </button>

              <button
                onClick={handleUploadClick}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <UploadCloudIcon className="w-4 h-4 text-violet-600" />
                Upload PDF Resume
              </button>

              <button
                onClick={() => router.push("/ats-score")}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Activity className="w-4 h-4 text-emerald-600" />
                Check ATS Score
              </button>

              <button
                onClick={() => router.push("/cover-letter")}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Generate Cover Letter
              </button>
            </div>
          </div>
        </div>

        {/* Resumes List Header */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-violet-600" />
              My Saved Resumes
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              {totalResumes} {totalResumes === 1 ? "resume" : "resumes"}
            </span>
          </div>

          {allResumes.length === 0 ? (
            <div className="text-center py-12 bg-white border border-slate-200/80 rounded-2xl max-w-sm mx-auto space-y-3">
              <p className="text-sm text-slate-400">No resumes found.</p>
              <button
                onClick={() => setShowCreatedResume(true)}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Create One Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allResumes.map((res) => {
                const isPortfolio = res.id === activePortfolioId;
                return (
                  <div
                    key={res.id}
                    className={`bg-white border border-slate-200 hover:border-violet-300 rounded-xl p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between min-h-[170px] relative group ${isPortfolio
                      ? "ring-1 ring-violet-500 border-violet-300"
                      : ""
                      }`}
                  >
                    {/* Top title and actions header row */}
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/dashboard/builder/${res.id}`}>
                          <h3 className="font-extrabold text-slate-700 group-hover:text-violet-600 transition-colors text-sm line-clamp-1 pr-6">
                            {res.title}
                          </h3>
                        </Link>

                        {/* Manage menu (Absolute upper right inside card) */}
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditResumeId(res.id.toString());
                              setTitle(res.title);
                            }}
                            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                            title="Rename"
                          >
                            <PencilIcon className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteResume(res.id, res.title)}
                            className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                            title="Delete"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Updated {new Date(res.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Middle details status line */}
                    <div className="flex flex-wrap items-center gap-1.5 my-2">
                      <span className="text-[9px] uppercase font-bold tracking-wide bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                        {res.template}
                      </span>
                      {isPortfolio && (
                        <span className="text-[9px] uppercase font-bold tracking-wide bg-violet-100 text-violet-700 px-2 py-0.5 rounded flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5" />
                          Portfolio Active
                        </span>
                      )}
                    </div>

                    {/* Bottom main operations bar */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {/* Flex main actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/builder/${res.id}`)
                          }
                          className="flex-1 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <FilePenLineIcon className="w-3 h-3" />
                          Edit Builder
                        </button>

                        <button
                          onClick={() =>
                            router.push(
                              `/ats-score?resumeId=${res?.portfolio?.id}`,
                            )
                          }
                          className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          title="ATS Score Check"
                        >
                          <Activity className="w-3 h-3" />
                          ATS Check
                        </button>
                      </div>

                      {/* Share toggle controls */}
                      <div className="flex items-center justify-between gap-2 pt-0.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500">
                          <Share2 className="w-3.5 h-3.5 text-violet-500" />
                          <span>Link Sharing</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {res.public && (
                            <button
                              onClick={() => copyShareLink(res.id)}
                              className="p-1 hover:bg-slate-200 text-violet-600 rounded cursor-pointer transition-colors"
                              title="Copy Shareable Link"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              toggleShareStatus(res.id, res.public)
                            }
                            className={`px-2 py-0.5 text-[9px] font-bold rounded border cursor-pointer transition-colors ${res.public
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
                              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100"
                              }`}
                          >
                            {res.public ? "ON" : "OFF"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL: CREATE RESUME */}
        {showCreatedResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreatedResume(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-sm p-6 space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-800">
                  Create a Resume
                </h2>
                <p className="text-xs text-slate-400">
                  Give your new document a name to launch the editor.
                </p>
              </div>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="e.g. Senior Frontend Developer"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:bg-white transition-all text-sm"
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-violet-100 disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Launch Builder"}
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreatedResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {/* MODAL: UPLOAD RESUME */}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-800">
                  Upload PDF Resume
                </h2>
                <p className="text-xs text-slate-400">
                  Import an existing PDF. Our AI agent will extract your
                  formatting structures.
                </p>
              </div>

              <div className="space-y-4">
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  type="text"
                  placeholder="Enter resume title..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:bg-white transition-all text-sm"
                  required
                />

                <div>
                  <label
                    htmlFor="resume-input"
                    className="border bg-slate-50/50 hover:bg-slate-50 border-2 border-dashed rounded-xl border-slate-200 hover:border-violet-500 p-8 flex flex-col items-center gap-3 cursor-pointer transition"
                  >
                    {resume ? (
                      <>
                        <FileText className="w-10 h-10 text-violet-600 animate-bounce" />
                        <p className="text-xs font-semibold text-violet-600 max-w-[200px] truncate">
                          {resume.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {(resume.size / 1024).toFixed(1)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <UploadCloudIcon className="w-10 h-10 text-slate-400" />
                        <p className="text-xs font-semibold text-slate-600">
                          Select PDF resume file
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Drag and drop here, or click to browse
                        </p>
                      </>
                    )}
                    <input
                      onChange={(e: any) => setResume(e.target.files[0])}
                      id="resume-input"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>

              <button
                disabled={isLoading || !resume}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-violet-100 disabled:opacity-50"
              >
                {isLoading && (
                  <LoaderCircleIcon className="animate-spin w-4 h-4 text-white" />
                )}
                {isLoading
                  ? "Extracting & Creating..."
                  : "Upload & Parse Resume"}
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                  setResume(null);
                }}
              />
            </div>
          </form>
        )}

        {/* MODAL: PUBLISH PORTFOLIO (SELECT RESUME TO LINK) */}
        {showPortfolioModal && (
          <div
            onClick={() => setShowPortfolioModal(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-5"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-800">
                  Link Portfolio Website
                </h2>
                <p className="text-xs text-slate-400">
                  Choose one resume below to turn into your public online
                  portfolio website.
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {allResumes.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-slate-700 line-clamp-1">
                        {res.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Template: {res.template} • Updated{" "}
                        {new Date(res.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div
                      key={res.id}
                      onClick={() => setSelectedPortfolioResumeId(res.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition
 ${selectedPortfolioResumeId === res.id
                          ? "border-violet-600 bg-violet-50"
                          : "border-slate-200"
                        }
 `}
                    >
                      <input
                        type="radio"
                        checked={selectedPortfolioResumeId === res.id}
                        onChange={() => setSelectedPortfolioResumeId(res.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                disabled={!selectedPortfolioResumeId || isGeneratingPortfolio}
                onClick={handleGeneratePortfolio}
                className="w-full py-3 mt-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold disabled:opacity-50"
              >
                {isGeneratingPortfolio
                  ? "Generating Portfolio..."
                  : "Continue & Generate Portfolio"}
              </button>

              <div className="pt-2">
                <button
                  onClick={() => setShowPortfolioModal(false)}
                  className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => setShowPortfolioModal(false)}
              />
            </div>
          </div>
        )}

        {/* MODAL: EDIT RESUME TITLE */}
        {editResumeId !== null && (
          <form
            onSubmit={editResumeTitle}
            onClick={() => setEditResumeId(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-sm p-6 space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-800">
                  Rename Resume
                </h2>
                <p className="text-xs text-slate-400">
                  Give your resume document a new name title.
                </p>
              </div>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:bg-white transition-all text-sm"
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-violet-100 disabled:opacity-50"
              >
                {isLoading ? "Renaming..." : "Update Title"}
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId(null);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {/* MODAL: HTML CODE EDITOR (PRO ONLY) */}
        {showHtmlEditorModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-700/60 shadow-2xl rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col justify-between overflow-hidden text-slate-100">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-violet-500/10 text-violet-400 rounded-lg">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Custom HTML Code Editor</h3>
                    <p className="text-[10px] text-slate-400">Directly modify and customize your portfolio codebase.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                    <button
                      onClick={() => setEditorTab("code")}
                      className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${editorTab === "code" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      HTML Code
                    </button>
                    <button
                      onClick={() => setEditorTab("preview")}
                      className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${editorTab === "preview" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      Live Preview
                    </button>
                  </div>

                  <button
                    onClick={() => setShowHtmlEditorModal(false)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Editor Workspace */}
              <div className="flex-1 overflow-hidden relative">
                {editorTab === "code" ? (
                  <textarea
                    value={editedHtml}
                    onChange={(e) => setEditedHtml(e.target.value)}
                    className="w-full h-full p-6 bg-slate-950 font-mono text-xs text-indigo-200 outline-none resize-none border-none overflow-y-auto leading-relaxed"
                    placeholder="<!-- Write custom HTML code here... -->"
                  />
                ) : (
                  <iframe
                    srcDoc={editedHtml}
                    className="w-full h-full border-none bg-white"
                    sandbox="allow-scripts"
                  />
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950">
                <p className="text-[10px] text-slate-400">
                  Tip: Use inline CSS styles inside <code>&lt;style&gt;</code> to customize design parameters.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowHtmlEditorModal(false)}
                    className="px-4 py-2 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-900 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveHtml}
                    disabled={isSavingHtml}
                    className="px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-violet-950/20 animate-pulse"
                  >
                    {isSavingHtml ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Save Changes</span>
                        <CheckIcon className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple check icon inline component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default Dashboard;
