"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Lock,
  Sparkles,
  X,
  ArrowLeft,
  LoaderCircle,
  Copy,
  Check,
  FileDown,
  Trash2,
  Edit,
  RefreshCw,
  AlertTriangle,
  AlertCircle,
  FileSpreadsheet,
  Building,
  Briefcase,
  UserCheck,
  Crown,
  Calendar,
  Eye,
  CopyIcon,
  ChevronRight,
  ChevronLeft,
  Save,
  HelpCircle,
} from "lucide-react";
import axiosInstance from "@/app/utils/axiosInstance";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";

// Define structures
interface Resume {
  id: number;
  title: string;
  template: string;
  updatedAt: string;
}

interface CoverLetter {
  id: number;
  companyName: string;
  jobTitle: string;
  hiringManager?: string;
  jobDescription?: string;
  tone: string;
  length: string;
  content: string;
  createdAt: string;
  resumeId?: number;
  resume?: {
    title: string;
    template: string;
    updatedAt: string;
  };
}

export default function CoverLetterPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.authReducer);

  // Lists & State
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [view, setView] = useState<"dashboard" | "wizard" | "preview">("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [resumeSource, setResumeSource] = useState<"saved" | "upload">("saved");
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  
  // Upload states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedText, setUploadedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  // Job Info
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // AI Options
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");

  // Generator Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Preview / Editor states
  const [activeLetter, setActiveLetter] = useState<CoverLetter | null>(null);
  const [isPreviewEditing, setIsPreviewEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generationStepsList = [
    "Analyzing resume details and achievements...",
    "Tailoring technical matching for target job role...",
    "Applying writing tone rules and structural guidelines...",
    "Polishing standard business greetings and layouts...",
    "Finishing up cover letter document generation...",
  ];

  // Fetch resumes and saved cover letters
  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [resumesRes, coverLettersRes] = await Promise.all([
        axiosInstance.get("/users/resumes"),
        axiosInstance.get("/cover-letters"),
      ]);
      setResumes(resumesRes.data.resumes || []);
      setCoverLetters(coverLettersRes.data.coverLetters || []);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load data. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Loading Steps cycle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setGenerationStep(0);
      interval = setInterval(() => {
        setGenerationStep((prev) => {
          if (prev < generationStepsList.length - 1) return prev + 1;
          return prev;
        });
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // PDF Text Extraction
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file. DOCX files should be converted to PDF first.");
      return;
    }

    setUploadedFile(file);
    setIsExtracting(true);
    try {
      const text = await pdfToText(file);
      setUploadedText(text);
      toast.success("Resume text extracted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to extract text from PDF. You can paste details instead.");
      setUploadedFile(null);
    } finally {
      setIsExtracting(false);
    }
  };

  // Generate Letter handler
  const handleGenerate = async () => {
    if (!companyName.trim() || !jobTitle.trim()) {
      toast.error("Company Name and Job Title are required!");
      return;
    }

    if (resumeSource === "saved" && !selectedResumeId) {
      toast.error("Please select a resume to use.");
      return;
    }

    if (resumeSource === "upload" && !uploadedText.trim()) {
      toast.error("Please upload a PDF resume first.");
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        resumeId: resumeSource === "saved" ? selectedResumeId : undefined,
        resumeText: resumeSource === "upload" ? uploadedText : undefined,
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        hiringManager: hiringManager.trim() || undefined,
        jobDescription: user?.isPro ? jobDescription.trim() : undefined,
        tone: user?.isPro ? tone : "Professional",
        length: user?.isPro ? length : "Medium",
      };

      const response = await axiosInstance.post("/cover-letters/generate", payload);
      if (response.data.success) {
        toast.success("Cover letter generated!");
        const newLetter = response.data.coverLetter;
        setCoverLetters([newLetter, ...coverLetters]);
        setActiveLetter(newLetter);
        setEditedContent(newLetter.content);
        setView("preview");
        resetWizard();
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to generate cover letter.";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update Cover Letter Text
  const handleSaveEdit = async () => {
    if (!activeLetter) return;
    setIsSavingEdit(true);
    try {
      const response = await axiosInstance.put(`/cover-letters/${activeLetter.id}`, {
        content: editedContent,
      });
      if (response.data.success) {
        toast.success("Cover letter saved successfully!");
        const updated = response.data.coverLetter;
        setCoverLetters(coverLetters.map(cl => cl.id === updated.id ? updated : cl));
        setActiveLetter(updated);
        setIsPreviewEditing(false);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update cover letter.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Duplicate Cover Letter
  const handleDuplicate = async (id: number) => {
    try {
      const response = await axiosInstance.post(`/cover-letters/${id}/duplicate`);
      if (response.data.success) {
        toast.success("Cover letter cloned successfully!");
        setCoverLetters([response.data.coverLetter, ...coverLetters]);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to duplicate cover letter.");
    }
  };

  // Delete Cover Letter
  const handleDelete = async (letter: CoverLetter) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-800">
          Delete cover letter for {letter.jobTitle} at {letter.companyName}?
        </p>
        <div className="flex gap-2">
          <button
            className="bg-rose-500 hover:bg-rose-600 text-white px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer"
            onClick={async () => {
              try {
                const response = await axiosInstance.delete(`/cover-letters/${letter.id}`);
                if (response.data.success) {
                  toast.success("Deleted successfully!");
                  setCoverLetters(coverLetters.filter(cl => cl.id !== letter.id));
                  if (activeLetter?.id === letter.id) {
                    setActiveLetter(null);
                    setView("dashboard");
                  }
                }
                toast.dismiss(t.id);
              } catch (error: any) {
                console.error(error);
                toast.error("Failed to delete cover letter.");
              }
            }}
          >
            Delete
          </button>
          <button
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  // Regenerate Cover Letter
  const handleRegenerate = async () => {
    if (!activeLetter) return;
    setIsGenerating(true);
    try {
      const payload = {
        resumeId: activeLetter.resumeId || undefined,
        companyName: activeLetter.companyName,
        jobTitle: activeLetter.jobTitle,
        hiringManager: activeLetter.hiringManager || undefined,
        jobDescription: user?.isPro ? activeLetter.jobDescription : undefined,
        tone: activeLetter.tone,
        length: activeLetter.length,
      };

      const response = await axiosInstance.post("/cover-letters/generate", payload);
      if (response.data.success) {
        toast.success("Cover letter regenerated successfully!");
        const newLetter = response.data.coverLetter;
        setCoverLetters([newLetter, ...coverLetters.filter(cl => cl.id !== activeLetter.id)]);
        setActiveLetter(newLetter);
        setEditedContent(newLetter.content);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to regenerate cover letter.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Print helper (PDF download)
  const downloadPDF = () => {
    if (!activeLetter) return;
    const printWindow = window.open("", "", "height=700,width=900");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${activeLetter.jobTitle} - ${activeLetter.companyName} Cover Letter</title>
            <style>
              body {
                font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif;
                color: #1e293b;
                line-height: 1.6;
                padding: 50px 70px;
                font-size: 14px;
              }
              .date {
                margin-bottom: 25px;
                color: #64748b;
              }
              .recipient {
                margin-bottom: 30px;
                font-weight: 500;
              }
              .salutation {
                margin-bottom: 20px;
              }
              .body-content {
                white-space: pre-wrap;
                text-align: justify;
                margin-bottom: 40px;
              }
              .signoff {
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="date">${new Date(activeLetter.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div class="recipient">
              ${activeLetter.hiringManager ? `${activeLetter.hiringManager}<br/>` : "Hiring Manager<br/>"}
              ${activeLetter.companyName}
            </div>
            <div class="salutation">Dear ${activeLetter.hiringManager || "Hiring Manager"},</div>
            <div class="body-content">${activeLetter.content}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      // Small timeout to ensure styling is loaded
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  // DOCX download helper (standard Word doc file download)
  const downloadDOCX = () => {
    if (!activeLetter) return;
    const dateStr = new Date(activeLetter.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    const fullText = `
${dateStr}

To,
${activeLetter.hiringManager || "Hiring Manager"}
${activeLetter.companyName}

Dear ${activeLetter.hiringManager || "Hiring Manager"},

${activeLetter.content}
`;
    
    const blob = new Blob([fullText], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeLetter.companyName.replace(/\s+/g, "_")}_Cover_Letter.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!activeLetter) return;
    navigator.clipboard.writeText(activeLetter.content);
    setIsCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const resetWizard = () => {
    setWizardStep(1);
    setCompanyName("");
    setJobTitle("");
    setHiringManager("");
    setJobDescription("");
    setUploadedFile(null);
    setUploadedText("");
    setSelectedResumeId(null);
    setTone("Professional");
    setLength("Medium");
  };

  // Filter cover letters by searchTerm
  const filteredLetters = coverLetters.filter((cl) => {
    const term = searchTerm.toLowerCase();
    return cl.companyName.toLowerCase().includes(term) || cl.jobTitle.toLowerCase().includes(term);
  });

  // Limits Check for generation blocking
  const getIsLimitReached = () => {
    if (!user) return true;
    if (user.isPro) {
      return false; // Pro users has no global limits (only 3 per resume limit which is checked on step select)
    }
    // Free plan: Max 2 total cover letters
    return coverLetters.length >= 2;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans">
      
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => {
              if (view !== "dashboard") {
                setView("dashboard");
                resetWizard();
              } else {
                router.push("/dashboard");
              }
            }}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {view === "dashboard" ? "Back to Dashboard" : "Cancel & Return"}
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Generated: <strong className="text-slate-800">{coverLetters.length}</strong>
            </span>
            {user?.isPro ? (
              <span className="text-[11px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700 border border-violet-200 px-3 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-violet-700 text-violet-700" />
                Pro Active
              </span>
            ) : (
              <button
                onClick={() => router.push("/pricing")}
                className="text-[11px] font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DASHBOARD VIEW */}
      {view === "dashboard" && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Header Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-8 md:p-12 shadow-md mb-8">
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-bold uppercase tracking-wider mb-4 text-violet-200">
                <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                Tailored Job Application Assets
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                AI Cover Letter Generator
              </h1>
              <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                Create highly tailored, professional business cover letters aligned directly with your technical resume profile and job specifications. Stand out to recruitment teams and Applicant Tracking Systems.
              </p>
            </div>
            
            {/* Crown ambient decoration */}
            <div className="absolute right-0 bottom-0 top-0 w-1/4 opacity-15 pointer-events-none hidden md:block">
              <Crown className="w-64 h-64 text-white absolute -right-16 -bottom-16" />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            
            {/* Search */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by company or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
              />
            </div>

            {/* Create New Trigger */}
            <button
              onClick={() => {
                if (getIsLimitReached()) {
                  toast.error("You have reached the Free Plan limit of 2 cover letters. Please upgrade to Pro.");
                  router.push("/pricing");
                } else {
                  setView("wizard");
                }
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-violet-200/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
              Generate Cover Letter
            </button>
          </div>

          {/* Content Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoaderCircle className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
          ) : filteredLetters.length === 0 ? (
            
            /* Empty State */
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm space-y-5">
              <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto border border-violet-100">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-lg text-slate-800">
                  No Cover Letters Yet
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tailor your first ATS-friendly business cover letter for job submissions using your existing resumes or by uploading a PDF document.
                </p>
              </div>
              <button
                onClick={() => {
                  if (getIsLimitReached()) {
                    toast.error("You have reached the Free Plan limit of 2 cover letters. Please upgrade to Pro.");
                    router.push("/pricing");
                  } else {
                    setView("wizard");
                  }
                }}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Create Cover Letter
              </button>
            </div>
          ) : (
            
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLetters.map((letter) => (
                <div
                  key={letter.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {letter.companyName}
                        </span>
                        <h3 className="font-bold text-slate-800 text-base group-hover:text-violet-600 transition-colors line-clamp-1">
                          {letter.jobTitle}
                        </h3>
                      </div>
                      
                      {/* Tone Badge */}
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-slate-200">
                        {letter.tone}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {letter.content}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {letter.resume ? letter.resume.title : "Uploaded PDF"}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(letter.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveLetter(letter);
                          setEditedContent(letter.content);
                          setView("preview");
                          setIsPreviewEditing(false);
                        }}
                        title="View & Edit"
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-violet-600 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(letter.id)}
                        title="Duplicate"
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-violet-600 transition-colors cursor-pointer"
                      >
                        <CopyIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(letter)}
                        title="Delete"
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MULTI-STEP CREATION WIZARD */}
      {view === "wizard" && (
        <div className="max-w-3xl mx-auto px-4 py-8">
          
          {/* Stepper progress indicator */}
          <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center shadow-sm">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    wizardStep >= step
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step}
                </div>
                <span
                  className={`text-xs font-semibold hidden md:inline ${
                    wizardStep === step ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {step === 1 && "Resume"}
                  {step === 2 && "Job details"}
                  {step === 3 && "Personalization"}
                  {step === 4 && "AI Options"}
                  {step === 5 && "Review"}
                </span>
                {step < 5 && (
                  <div className="w-4 md:w-8 h-0.5 bg-slate-100 rounded hidden sm:block" />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">

            {/* STEP 1: RESUME SELECTION */}
            {wizardStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                    <FileText className="w-5.5 h-5.5 text-violet-600" />
                    Step 1: Choose or Upload Resume
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a resume from your profile or upload a PDF document. AI will construct your letter based on these qualifications.
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                  <button
                    onClick={() => setResumeSource("saved")}
                    className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                      resumeSource === "saved"
                        ? "border-violet-600 text-violet-600"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    My Saved Resumes
                  </button>
                  <button
                    onClick={() => setResumeSource("upload")}
                    className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                      resumeSource === "upload"
                        ? "border-violet-600 text-violet-600"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Upload PDF Resume
                  </button>
                </div>

                {/* Tab: Saved Resumes */}
                {resumeSource === "saved" && (
                  <div className="space-y-4">
                    {resumes.length === 0 ? (
                      /* Empty Saved Resumes State */
                      <div className="text-center py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl space-y-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-slate-400 shadow-sm">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-700">You haven't created a resume yet</p>
                          <p className="text-xs text-slate-400">Create a resume profile in the dashboard to access tailoring.</p>
                        </div>
                        <button
                          onClick={() => router.push("/dashboard")}
                          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Create Resume
                        </button>
                      </div>
                    ) : (
                      /* Resume selection grid */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
                        {resumes.map((res) => {
                          const isSelected = selectedResumeId === res.id;
                          return (
                            <button
                              key={res.id}
                              type="button"
                              onClick={() => setSelectedResumeId(res.id)}
                              className={`flex items-start justify-between p-4 rounded-xl border text-left transition-all hover:shadow-sm cursor-pointer ${
                                isSelected
                                  ? "border-violet-600 bg-violet-50/20 ring-1 ring-violet-500"
                                  : "border-slate-200 bg-white hover:border-slate-300"
                              }`}
                            >
                              <div className="space-y-1">
                                <h3 className="font-bold text-slate-700 line-clamp-1 text-sm">
                                  {res.title}
                                </h3>
                                <p className="text-[10px] text-slate-400">
                                  Updated {new Date(res.updatedAt).toLocaleDateString()}
                                </p>
                                <span className="inline-block text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider mt-1 border border-slate-200">
                                  {res.template}
                                </span>
                              </div>
                              {isSelected && (
                                <div className="p-0.5 rounded-full bg-violet-600 text-white">
                                  <CheckCircle2 className="w-4 h-4 fill-violet-600 text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Upload File */}
                {resumeSource === "upload" && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-violet-500 rounded-xl p-8 transition-colors bg-slate-50/50 cursor-pointer relative">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isExtracting}
                      />
                      <Sparkles className={`w-10 h-10 text-slate-400 mb-2 ${isExtracting ? "animate-bounce" : ""}`} />
                      <p className="font-bold text-slate-600 text-xs mb-1">
                        {isExtracting ? "Extracting qualifications..." : "Upload Resume PDF"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Supports PDF format up to 5MB
                      </p>
                    </div>

                    {uploadedFile && (
                      <div className="flex items-center justify-between p-3 bg-violet-50/20 border border-violet-100 rounded-xl">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-violet-600" />
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-700 max-w-[200px] truncate">
                              {uploadedFile.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {(uploadedFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setUploadedFile(null);
                            setUploadedText("");
                          }}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: JOB DETAILS */}
            {wizardStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                    <Building className="w-5.5 h-5.5 text-violet-600" />
                    Step 2: Job Information
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter the company and details of the job you are targeting.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                        Company Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Google, Stripe, etc."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full text-sm p-3 bg-white border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                        Job Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Senior Software Engineer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full text-sm p-3 bg-white border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                      Hiring Manager Name <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe (Leave blank for default 'Hiring Manager')"
                      value={hiringManager}
                      onChange={(e) => setHiringManager(e.target.value)}
                      className="w-full text-sm p-3 bg-white border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PERSONALIZATION (JOB DESCRIPTION BLUR STATE FOR FREE USER) */}
            {wizardStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                      <Briefcase className="w-5.5 h-5.5 text-violet-600" />
                      Step 3: Job Description
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Paste the role description here to tailor cover letter keywords directly.
                    </p>
                  </div>
                  
                  {!user?.isPro && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 rounded px-2 py-0.5 uppercase flex items-center gap-0.5">
                      <Crown className="w-3 h-3 fill-amber-700 text-amber-700" /> Pro Feature
                    </span>
                  )}
                </div>

                <div className="relative">
                  {/* Lock Screen Overlay for Free users */}
                  {!user?.isPro && (
                    <div className="absolute inset-0 bg-slate-50/20 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center rounded-xl border border-slate-200 bg-white/60">
                      <div className="bg-white p-3 rounded-full shadow-sm text-amber-500 border border-slate-100 mb-2">
                        <Lock className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-extrabold text-slate-700">Unlock Tailored Cover Letters</p>
                      <p className="text-[10px] text-slate-400 max-w-[280px] mt-0.5">
                        Upgrade to Pro to tailor cover letters directly against job descriptions.
                      </p>
                      <button
                        onClick={() => router.push("/pricing")}
                        className="mt-3 px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm cursor-pointer"
                      >
                        Upgrade to Pro
                      </button>
                    </div>
                  )}

                  <textarea
                    rows={6}
                    placeholder="We require a software engineer with 3+ years experience in React, Next.js, Node.js, and Postgres..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={!user?.isPro}
                    className={`w-full text-sm p-4 bg-white border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none ${
                      !user?.isPro ? "blur-[2px] pointer-events-none select-none text-slate-300" : ""
                    }`}
                  />
                </div>
              </div>
            )}

            {/* STEP 4: AI OPTIONS (LOCK CERTAIN OPTIONS ON FREE TIER) */}
            {wizardStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                    <UserCheck className="w-5.5 h-5.5 text-violet-600" />
                    Step 4: AI Customizations
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Fine-tune tone and document layout length properties.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Tone Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Cover Letter Tone
                      </label>
                      {!user?.isPro && (
                        <span className="text-[9px] text-slate-400 flex items-center gap-1 font-semibold">
                          <Lock className="w-3 h-3" /> Pro unlocks all tones
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { name: "Professional", desc: "Formal & corporate" },
                        { name: "Friendly", desc: "Warm & warm tone" },
                        { name: "Confident", desc: "Value-centric & direct" },
                        { name: "Enthusiastic", desc: "Passionate & excited" },
                        { name: "Formal", desc: "Traditional style" },
                        { name: "Startup Style", desc: "Modern & conversational" },
                      ].map((t) => {
                        const isUnlocked = user?.isPro || t.name === "Professional";
                        const isSelected = tone === t.name;
                        return (
                          <button
                            key={t.name}
                            type="button"
                            disabled={!isUnlocked}
                            onClick={() => setTone(t.name)}
                            className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? "border-violet-600 bg-violet-50/20 ring-1 ring-violet-500"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            } ${!isUnlocked ? "opacity-60 cursor-not-allowed bg-slate-50" : ""}`}
                          >
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-xs text-slate-700">{t.name}</h4>
                              <p className="text-[10px] text-slate-400">{t.desc}</p>
                            </div>
                            {!isUnlocked && (
                              <Lock className="w-3.5 h-3.5 absolute top-2 right-2 text-slate-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Length Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Document Length
                      </label>
                      {!user?.isPro && (
                        <span className="text-[9px] text-slate-400 flex items-center gap-1 font-semibold">
                          <Lock className="w-3 h-3" /> Pro unlocks all lengths
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: "Short", desc: "~150 words" },
                        { name: "Medium", desc: "~250 words" },
                        { name: "Detailed", desc: "~400 words" },
                      ].map((l) => {
                        const isUnlocked = user?.isPro || l.name === "Medium";
                        const isSelected = length === l.name;
                        return (
                          <button
                            key={l.name}
                            type="button"
                            disabled={!isUnlocked}
                            onClick={() => setLength(l.name)}
                            className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? "border-violet-600 bg-violet-50/20 ring-1 ring-violet-500"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            } ${!isUnlocked ? "opacity-60 cursor-not-allowed bg-slate-50" : ""}`}
                          >
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-xs text-slate-700">{l.name}</h4>
                              <p className="text-[10px] text-slate-400">{l.desc}</p>
                            </div>
                            {!isUnlocked && (
                              <Lock className="w-3.5 h-3.5 absolute top-2 right-2 text-slate-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: FINAL REVIEW */}
            {wizardStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5.5 h-5.5 text-violet-600" />
                    Step 5: Generate Cover Letter
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Review selected setup parameters before launching generative sequence.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block font-semibold mb-0.5">TARGET COMPANY</span>
                      <span className="font-bold text-slate-700">{companyName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold mb-0.5">JOB ROLE</span>
                      <span className="font-bold text-slate-700">{jobTitle}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold mb-0.5">HIRING MANAGER</span>
                      <span className="font-bold text-slate-700">{hiringManager || "Hiring Manager"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold mb-0.5">SOURCE PROFILE</span>
                      <span className="font-bold text-slate-700">
                        {resumeSource === "saved" 
                          ? resumes.find(r => r.id === selectedResumeId)?.title 
                          : "Uploaded PDF File"}
                      </span>
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block font-semibold mb-0.5">TONE STYLE</span>
                      <span className="font-bold text-slate-700 uppercase tracking-wider">{tone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold mb-0.5">DOCUMENT DEPTH</span>
                      <span className="font-bold text-slate-700 uppercase tracking-wider">{length}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-violet-200/50 hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-violet-200" />
                  Generate Cover Letter
                </button>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(wizardStep - 1)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Step
              </button>

              {wizardStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* SKELETON LOADER OVERLAY FOR GENERATION */}
      {isGenerating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-8 text-center space-y-6 animate-scaleIn">
            
            {/* Pulsing loading sphere */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
              <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
              <div className="absolute inset-4 rounded-full bg-violet-50 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-violet-600 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-slate-800">
                Tailoring Cover Letter
              </h3>
              <p className="text-xs text-slate-400">
                Generating your personalized cover letter...
              </p>
            </div>

            {/* Simulated progress checklist */}
            <div className="text-left space-y-3 bg-slate-50 p-4 rounded-xl">
              {generationStepsList.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-none transition-colors ${
                      idx < generationStep
                        ? "bg-emerald-500"
                        : idx === generationStep
                        ? "bg-violet-600 animate-ping"
                        : "bg-slate-200"
                    }`}
                  />
                  <p
                    className={`text-[11px] transition-colors ${
                      idx <= generationStep ? "text-slate-700 font-semibold" : "text-slate-400"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW / EDIT SCREEN */}
      {view === "preview" && activeLetter && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          {/* Action Toolbar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("dashboard")}
                className="px-3 py-1.5 hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Text
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Edit Action Toggle */}
              {isPreviewEditing ? (
                <button
                  onClick={handleSaveEdit}
                  disabled={isSavingEdit}
                  className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Edits
                </button>
              ) : (
                <button
                  onClick={() => setIsPreviewEditing(true)}
                  className="px-3.5 py-1.5 hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Letter
                </button>
              )}

              <button
                onClick={handleRegenerate}
                className="px-3.5 py-1.5 hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>

              {/* Downloads */}
              <button
                onClick={downloadPDF}
                className="px-3.5 py-1.5 hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5 text-red-500" />
                PDF
              </button>

              <button
                onClick={downloadDOCX}
                className="px-3.5 py-1.5 hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5 text-blue-500" />
                DOCX
              </button>
            </div>
          </div>

          {/* Letter Document Canvas */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm space-y-6 min-h-[700px] relative">
            
            {/* Header info */}
            <div className="border-b border-slate-100 pb-6 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-500">COVER LETTER TARGET</span>
                <p className="font-bold text-slate-800 text-sm">{activeLetter.jobTitle} at {activeLetter.companyName}</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="font-bold text-slate-500">DATE GENERATED</span>
                <p className="font-bold text-slate-800 text-sm">
                  {new Date(activeLetter.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">
                To,
              </p>
              <p className="font-medium text-slate-700">
                {activeLetter.hiringManager || "Hiring Manager"}
              </p>
              <p className="font-semibold text-slate-900">
                {activeLetter.companyName}
              </p>
            </div>

            {/* Inline Editor or Display Render */}
            {isPreviewEditing ? (
              <div className="space-y-2">
                <textarea
                  rows={20}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full text-sm p-4 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 bg-white outline-none leading-relaxed"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditedContent(activeLetter.content);
                      setIsPreviewEditing(false);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-sm text-slate-700 leading-relaxed text-justify">
                <p>Dear {activeLetter.hiringManager || "Hiring Manager"},</p>
                <div id="cover-letter-preview" className="white-space-pre-wrap leading-relaxed">
                  <p id="cover-letter-text" className="whitespace-pre-wrap">{activeLetter.content}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
