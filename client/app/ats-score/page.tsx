"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
    FileText,
    UploadCloud,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Sparkles,
    X,
    ArrowLeft,
    Info,
    Layers,
    Activity,
    FileCheck2,
    Search,
    Award,
    ChevronDown,
    ChevronUp,
    Lock,
} from "lucide-react";
import axiosInstance from "@/app/utils/axiosInstance";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
// Define TypeScript interfaces for the ATS API response
interface BreakdownItem {
    score: number;
    feedback: string;
}
interface Improvement {
    section: string;
    severity: "high" | "medium" | "low";
    issue: string;
    suggestion: string;
}
interface AtsAnalysisResult {
    score: number;
    summary: string;
    breakdown: {
        formatting: BreakdownItem;
        structure: BreakdownItem;
        contentQuality: BreakdownItem;
        keywordMatch: BreakdownItem;
    };
    missingKeywords: string[];
    improvements: Improvement[];
    atsFriendlyAdvice: string;
}
const AtsScoreCheck = () => {
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.authReducer);
    const [allResumes, setAllResumes] = useState<any[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState<string>("");
    const [jobDescription, setJobDescription] = useState<string>("");
    const [isExtracting, setIsExtracting] = useState<boolean>(false);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [loadingStep, setLoadingStep] = useState<number>(0);
    const [analysisResult, setAnalysisResult] = useState<AtsAnalysisResult | null>(null);
    const [activeTab, setActiveTab] = useState<"existing" | "upload">("upload");
    const [expandedImprovements, setExpandedImprovements] = useState<Record<number, boolean>>({});
    const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
    // Loading steps for the analysis progress loader
    const analysisSteps = [
        "Extracting and normalizing resume text...",
        "Analyzing document structure and headers...",
        "Scanning content readability and metrics...",
        "Evaluating semantic match and key terms...",
        "Synthesizing optimization checklist...",
    ];
    // Load resumes if user is logged in
    useEffect(() => {
        if (user) {
            setActiveTab("existing");
            const loadAllResumes = async () => {
                try {
                    const response = await axiosInstance.get("/users/resumes");
                    setAllResumes(response.data.resumes || []);
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Failed to load resumes");
                }
            };
            loadAllResumes();
        } else {
            setActiveTab("upload");
        }
        // Check query params to pre-select resume
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const resumeIdParam = params.get("resumeId");
            if (resumeIdParam) {
                setSelectedResumeId(Number(resumeIdParam));
            }
        }
    }, [user]);
    // Cycle through loading steps during analysis
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAnalyzing) {
            setLoadingStep(0);
            interval = setInterval(() => {
                setLoadingStep((prev) => {
                    if (prev < analysisSteps.length - 1) {
                        return prev + 1;
                    }
                    return prev;
                });
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [isAnalyzing]);
    // Handler for file upload / PDF drop
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.type !== "application/pdf") {
            toast.error("Only PDF files are supported");
            return;
        }
        // Intercept if user is not logged in
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        setUploadedFile(file);
        setIsExtracting(true);
        try {
            const text = await pdfToText(file);
            setExtractedText(text);
            toast.success("Resume text extracted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to extract text from PDF. Try copy-pasting or use another resume.");
            setUploadedFile(null);
        } finally {
            setIsExtracting(false);
        }
    };
    // Convert selected resume data object to plain text representation
    const formatResumeToText = (resume: any) => {
        let text = "";
        if (resume.title) text += `Title: ${resume.title}\n`;
        if (resume.professionalSummary) text += `Professional Summary:\n${resume.professionalSummary}\n\n`;
        if (resume.personalInfo) {
            const pi = resume.personalInfo;
            text += `Contact Information:\n`;
            if (pi.fullName) text += `Name: ${pi.fullName}\n`;
            if (pi.profession) text += `Profession: ${pi.profession}\n`;
            if (pi.email) text += `Email: ${pi.email}\n`;
            if (pi.phone) text += `Phone: ${pi.phone}\n`;
            if (pi.location) text += `Location: ${pi.location}\n`;
            if (pi.linkedin) text += `LinkedIn: ${pi.linkedin}\n`;
            if (pi.website) text += `Website: ${pi.website}\n`;
            text += `\n`;
        }
        if (resume.skills && resume.skills.length > 0) {
            text += `Skills:\n${resume.skills.join(", ")}\n\n`;
        }
        if (resume.workExperience && resume.workExperience.length > 0) {
            text += `Work Experience:\n`;
            resume.workExperience.forEach((exp: any) => {
                text += `- Position: ${exp.position} at ${exp.company}\n`;
                text += `  Duration: ${exp.startDate} to ${exp.isCurrent ? "Present" : exp.endDate}\n`;
                text += `  Description: ${exp.description}\n`;
            });
            text += `\n`;
        }
        if (resume.education && resume.education.length > 0) {
            text += `Education:\n`;
            resume.education.forEach((edu: any) => {
                text += `- ${edu.degree} in ${edu.field} at ${edu.institution}\n`;
                text += `  Graduation: ${edu.graduationDate}\n`;
                if (edu.gpa) text += `  GPA: ${edu.gpa}\n`;
            });
            text += `\n`;
        }
        if (resume.projects && resume.projects.length > 0) {
            text += `Projects:\n`;
            resume.projects.forEach((proj: any) => {
                text += `- Project Name: ${proj.name} (${proj.type})\n`;
                text += `  Description: ${proj.description}\n`;
            });
            text += `\n`;
        }
        return text;
    };
    // Run ATS analysis handler
    const handleAtsCheck = async () => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        let payload: any = {
            jobDescription: jobDescription.trim() || undefined,
        };
        if (activeTab === "existing") {
            if (!selectedResumeId) {
                toast.error("Please select a resume to analyze");
                return;
            }
            payload.resumeId = selectedResumeId;
        } else {
            if (!extractedText) {
                toast.error("Please upload a PDF resume or wait for text extraction");
                return;
            }
            payload.resumeText = extractedText;
        }
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const response = await axiosInstance.post("/ai/ats-score", payload);
            if (response?.data?.analysisResult) {
                setAnalysisResult(response?.data?.analysisResult);
                toast.success("ATS Analysis completed!");
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to analyze ATS compatibility. Try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };
    // Reset the screen back to standard selection
    const handleReset = () => {
        setAnalysisResult(null);
        setUploadedFile(null);
        setExtractedText("");
        setSelectedResumeId(null);
    };
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-500 stroke-emerald-500 border-emerald-100 bg-emerald-50/50";
        if (score >= 60) return "text-amber-500 stroke-amber-500 border-amber-100 bg-amber-50/50";
        return "text-rose-500 stroke-rose-500 border-rose-100 bg-rose-50/50";
    };
    const getProgressColor = (score: number) => {
        if (score >= 80) return "bg-emerald-500";
        if (score >= 60) return "bg-amber-500";
        return "bg-rose-500";
    };
    const getSeverityBadge = (severity: "high" | "medium" | "low") => {
        switch (severity) {
            case "high":
                return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-700">High Priority</span>;
            case "medium":
                return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-700">Medium</span>;
            case "low":
                return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-700">Suggestion</span>;
        }
    };
    const toggleImprovement = (index: number) => {
        setExpandedImprovements((prev) => ({ ...prev, [index]: !prev[index] }));
    };
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-slate-800">
            {/* Back Button */}
            <button
                onClick={() => router.push(user ? "/dashboard" : "/")}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6 cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to {user ? "Dashboard" : "Home"}
            </button>
            {/* Main Educational Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white p-8 md:p-12 shadow-xl mb-8">
                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold tracking-wide uppercase mb-4 text-violet-200">
                        <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                        AI-Powered Optimization
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                        ATS Resume Score Analyzer
                    </h1>
                    <p className="text-base md:text-lg text-white/80 leading-relaxed">
                        Many employers use Applicant Tracking Systems (ATS) to filter out resumes. Analyze your resume's technical strength, readability, and key terms to guarantee you pass the initial screen.
                    </p>
                </div>
                {/* Background ambient shapes */}
                <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
                    <div className="w-64 h-64 bg-white/20 rounded-full blur-3xl absolute -right-20 -bottom-20" />
                    <div className="w-48 h-48 bg-purple-400/30 rounded-full blur-2xl absolute right-12 top-6" />
                </div>
            </div>
            {!analysisResult ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main selection forms (takes up 2 columns on lg screens) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 md:p-8">
                            <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                Step 1: Choose or Upload Resume
                            </h2>
                            {/* Selection Tabs */}
                            <div className="flex border-b border-slate-100 mb-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!user) {
                                            setShowAuthModal(true);
                                            return;
                                        }
                                        setActiveTab("existing");
                                    }}
                                    className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === "existing"
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    My Saved Resumes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("upload")}
                                    className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === "upload"
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    Upload New PDF
                                </button>
                            </div>
                            {/* Tab Content: Existing Resumes */}
                            {activeTab === "existing" && (
                                <div className="space-y-4">
                                    {allResumes.length === 0 ? (
                                        <div className="text-center py-8 border border-dashed border-slate-200 rounded-lg text-slate-400">
                                            <p className="mb-2">No saved resumes found.</p>
                                            <button
                                                onClick={() => router.push("/dashboard")}
                                                className="text-xs text-indigo-600 hover:underline font-semibold"
                                            >
                                                Create one first in the dashboard
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-1">
                                            {allResumes.map((res) => (
                                                <button
                                                    key={res.id}
                                                    type="button"
                                                    onClick={() => setSelectedResumeId(res.id)}
                                                    className={`flex items-start justify-between p-4 rounded-xl border text-left transition-all hover:shadow-md cursor-pointer ${selectedResumeId === res.id
                                                        ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500"
                                                        : "border-slate-200 bg-white hover:border-slate-300"
                                                        }`}
                                                >
                                                    <div className="space-y-1">
                                                        <h3 className="font-semibold text-slate-700 line-clamp-1">
                                                            {res.title}
                                                        </h3>
                                                        <p className="text-[11px] text-slate-400">
                                                            Updated on {new Date(res.updatedAt).toLocaleDateString()}
                                                        </p>
                                                        <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-bold mt-1.5">
                                                            {res.template}
                                                        </span>
                                                    </div>
                                                    {selectedResumeId === res.id && (
                                                        <div className="p-1 rounded-full bg-indigo-600 text-white">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* Tab Content: Upload PDF */}
                            {activeTab === "upload" && (
                                <div className="space-y-4">
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-8 transition-colors bg-slate-50/50 cursor-pointer relative">
                                        <input
                                            type="file"
                                            id="ats-resume-upload"
                                            accept=".pdf"
                                            onChange={handleFileUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            disabled={isExtracting}
                                        />
                                        <UploadCloud className={`w-12 h-12 text-slate-400 mb-3 ${isExtracting ? "animate-pulse" : ""}`} />
                                        <p className="font-semibold text-slate-600 text-sm mb-1">
                                            {isExtracting ? "Extracting Text..." : "Drag and drop your PDF resume"}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Supports only PDF documents (Max 5MB)
                                        </p>
                                    </div>
                                    {uploadedFile && (
                                        <div className="flex items-center justify-between p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-indigo-600" />
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-700 truncate max-w-xs sm:max-w-md">
                                                        {uploadedFile.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">
                                                        {(uploadedFile.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUploadedFile(null);
                                                    setExtractedText("");
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
                        {/* Job Description Textarea */}
                        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 md:p-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <Search className="w-5 h-5 text-indigo-600" />
                                        Step 2: Add Job Description (Optional)
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Paste the specific role requirements to compare your resume directly against key keywords.
                                    </p>
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-0.5 bg-slate-100 rounded">
                                    Highly Recommended
                                </span>
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here (e.g. key responsibilities, requirements, languages, framework guidelines)..."
                                rows={5}
                                className="w-full text-sm p-4 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                            />
                        </div>
                        {/* Run Button */}
                        <button
                            onClick={handleAtsCheck}
                            disabled={isAnalyzing || isExtracting || (activeTab === "existing" ? !selectedResumeId : !extractedText)}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-indigo-200/50 hover:shadow-xl transition-all active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:pointer-events-none disabled:shadow-none"
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Analyzing Resume...
                                </>
                            ) : (
                                <>
                                    <Activity className="w-5 h-5" />
                                    Analyze Resume ATS Score
                                </>
                            )}
                        </button>
                    </div>
                    {/* Educational Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 space-y-6">
                            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 pb-3 border-b border-slate-100">
                                <Info className="w-5 h-5 text-indigo-600" />
                                ATS Scoring Guidelines
                            </h3>
                            <div className="space-y-4 text-xs leading-relaxed text-slate-500">
                                <div className="flex gap-3">
                                    <div className="flex-none w-6 h-6 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-700 mb-0.5">80+ (Excellent)</h4>
                                        <p>Your resume matches structural benchmarks and keyword density constraints correctly. Minimum fixes needed.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-none w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-700 mb-0.5">60 - 79 (Good)</h4>
                                        <p>Readable structure, but lacks either specific role keywords or measurable outcomes (like percentages/numbers).</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-none w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-700 mb-0.5">&lt;60 (Action Required)</h4>
                                        <p>Weak section definition, excessive design artifacts, or severe keyword alignment mismatches. Standard overhaul is needed.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-indigo-900 rounded-xl shadow-md text-white p-6 relative overflow-hidden">
                            <div className="relative z-10 space-y-3">
                                <Award className="w-10 h-10 text-violet-300" />
                                <h3 className="font-bold text-lg">Did you know?</h3>
                                <p className="text-xs text-indigo-200 leading-relaxed">
                                    Avoid tables, charts, graphics, and headers/footers in your resume. Modern parser software ignores drawings or text boxes, which can skip your details entirely during parsing. Keep it clean and text-focused.
                                </p>
                            </div>
                            <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-800 rounded-full blur-xl opacity-50 -mr-6 -mb-6" />
                        </div>
                    </div>
                </div>
            ) : null}
            {/* Progressive loading step state overlay */}
            {isAnalyzing && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-8 text-center space-y-6">
                        {/* Spinning loader grid */}
                        <div className="relative w-20 h-20 mx-auto">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                            <div className="absolute inset-4 rounded-full bg-indigo-50 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg text-slate-800">
                                Evaluating Resume
                            </h3>
                            <p className="text-xs text-slate-400">
                                This takes a few seconds as the AI runs an inspection check...
                            </p>
                        </div>
                        {/* Stepper progress representation */}
                        <div className="text-left space-y-3 bg-slate-50 p-4 rounded-xl">
                            {analysisSteps.map((step, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full flex-none transition-colors ${idx < loadingStep
                                        ? "bg-emerald-500"
                                        : idx === loadingStep
                                            ? "bg-indigo-600 animate-ping"
                                            : "bg-slate-200"
                                        }`} />
                                    <p className={`text-xs transition-colors ${idx <= loadingStep ? "text-slate-700 font-semibold" : "text-slate-400"
                                        }`}>
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* ANALYSIS RESULTS DASHBOARD PANEL */}
            {analysisResult && (
                <div className="space-y-8 animate-fadeIn">
                    {/* Dashboard Panel Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                Analysis Report Results
                            </h2>
                            <p className="text-sm text-slate-500">
                                Overall score check completed based on ATS scoring constraints.
                            </p>
                        </div>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer w-fit"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Analyze Another Resume
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left side: Overall circular gauge + Section progress scores */}
                        <div className="space-y-6 lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 flex flex-col items-center text-center">
                                <h3 className="font-bold text-slate-700 mb-6 text-sm">
                                    Overall ATS Compatibility
                                </h3>
                                {/* SVG Circular Progress Score */}
                                <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        {/* Background grey track */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="42"
                                            className="stroke-slate-100 fill-transparent"
                                            strokeWidth="8"
                                        />
                                        {/* Colored overlay track */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="42"
                                            className={`fill-transparent transition-all duration-1000 ${analysisResult.score >= 80
                                                ? "stroke-emerald-500"
                                                : analysisResult.score >= 60
                                                    ? "stroke-amber-500"
                                                    : "stroke-rose-500"
                                                }`}
                                            strokeWidth="8"
                                            strokeDasharray="263.89"
                                            strokeDashoffset={263.89 - (263.89 * analysisResult.score) / 100}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute text-center">
                                        <span className="text-4xl font-extrabold text-slate-800">
                                            {analysisResult.score}
                                        </span>
                                        <span className="text-slate-400 text-sm block">/ 100</span>
                                    </div>
                                </div>
                                <div className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider mb-4 ${getScoreColor(analysisResult.score)}`}>
                                    {analysisResult.score >= 80
                                        ? "Excellent Fit"
                                        : analysisResult.score >= 60
                                            ? "Average Fit"
                                            : "Action Needed"}
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                                    {analysisResult.summary}
                                </p>
                            </div>
                            {/* Categorized Breakdown Scores */}
                            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 space-y-6">
                                <h3 className="font-bold text-slate-700 text-sm border-b border-slate-100 pb-3">
                                    Score Breakdown Analysis
                                </h3>
                                <div className="space-y-4">
                                    {/* Formatting */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-semibold text-slate-600">Formatting Check</span>
                                            <span className="font-bold text-slate-800">{analysisResult.breakdown.formatting.score}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(analysisResult.breakdown.formatting.score)}`}
                                                style={{ width: `${analysisResult.breakdown.formatting.score}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 leading-normal pt-0.5">
                                            {analysisResult.breakdown.formatting.feedback}
                                        </p>
                                    </div>
                                    {/* Structure */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-semibold text-slate-600">Structure & Sections</span>
                                            <span className="font-bold text-slate-800">{analysisResult.breakdown.structure.score}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(analysisResult.breakdown.structure.score)}`}
                                                style={{ width: `${analysisResult.breakdown.structure.score}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 leading-normal pt-0.5">
                                            {analysisResult.breakdown.structure.feedback}
                                        </p>
                                    </div>
                                    {/* Content Quality */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-semibold text-slate-600">Content Quality</span>
                                            <span className="font-bold text-slate-800">{analysisResult.breakdown.contentQuality.score}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(analysisResult.breakdown.contentQuality.score)}`}
                                                style={{ width: `${analysisResult.breakdown.contentQuality.score}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 leading-normal pt-0.5">
                                            {analysisResult.breakdown.contentQuality.feedback}
                                        </p>
                                    </div>
                                    {/* Keyword Match */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-semibold text-slate-600">Keyword Matching</span>
                                            <span className="font-bold text-slate-800">{analysisResult.breakdown.keywordMatch.score}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(analysisResult.breakdown.keywordMatch.score)}`}
                                                style={{ width: `${analysisResult.breakdown.keywordMatch.score}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 leading-normal pt-0.5">
                                            {analysisResult.breakdown.keywordMatch.feedback}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right side: Action Items checklists + Keywords */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Missing Keywords Box */}
                            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
                                <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
                                    <Search className="w-4.5 h-4.5 text-indigo-600" />
                                    Recommended / Missing Keywords
                                </h3>
                                <p className="text-xs text-slate-400 mb-4">
                                    These key terms and skills are missing or weak on your resume relative to industry benchmarks or your target job description. We recommend adding them details-wise:
                                </p>
                                {analysisResult.missingKeywords.length === 0 ? (
                                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> Good keyword inclusion! No severe missing terms identified.
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.missingKeywords.map((kw, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 select-all hover:bg-slate-100 transition-colors"
                                            >
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Action Checklist Accordion List */}
                            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6">
                                <h3 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
                                    <FileCheck2 className="w-4.5 h-4.5 text-indigo-600" />
                                    Actionable Checklist Suggestions
                                </h3>
                                {analysisResult.improvements.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                                        <p className="font-semibold text-slate-700">Perfect resume structure!</p>
                                        <p className="text-xs">We couldn't find any specific improvements needed.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {analysisResult.improvements.map((imp, idx) => (
                                            <div key={idx} className="py-4 first:pt-0 last:pb-0">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleImprovement(idx)}
                                                    className="w-full flex items-start justify-between text-left focus:outline-none cursor-pointer"
                                                >
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {getSeverityBadge(imp.severity)}
                                                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1.5 py-0.5 bg-slate-50 rounded">
                                                                {imp.section}
                                                            </span>
                                                        </div>
                                                        <h4 className="font-semibold text-sm text-slate-700 pt-1">
                                                            {imp.issue}
                                                        </h4>
                                                    </div>
                                                    {expandedImprovements[idx] ? (
                                                        <ChevronUp className="w-4 h-4 text-slate-400 mt-1" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-slate-400 mt-1" />
                                                    )}
                                                </button>
                                                {expandedImprovements[idx] && (
                                                    <div className="mt-3 bg-slate-50/50 border border-slate-100 rounded-lg p-4 text-xs space-y-2 animate-fadeIn">
                                                        <h5 className="font-bold text-slate-600 flex items-center gap-1.5">
                                                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Recommended Action Suggestion:
                                                        </h5>
                                                        <p className="text-slate-500 leading-relaxed font-mono whitespace-pre-line bg-white p-3 rounded border border-slate-200">
                                                            {imp.suggestion}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Standard ATS General Best Practices Box */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative overflow-hidden">
                                <div className="relative z-10 space-y-2 text-xs">
                                    <h4 className="font-bold text-indigo-900 flex items-center gap-1.5">
                                        <Info className="w-4 h-4" /> Standard ATS Best Practices
                                    </h4>
                                    <p className="text-indigo-800 leading-relaxed">
                                        {analysisResult.atsFriendlyAdvice}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* AUTH REQUIRED MODAL */}
            {showAuthModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl p-6 text-center space-y-4 relative border border-slate-100">
                        <button
                            onClick={() => setShowAuthModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mx-auto">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-800">
                                Sign in to Scan Resume
                            </h3>
                            <p className="text-xs text-slate-400">
                                You must have a free account to use our AI-powered ATS resume analyzer. Sign up or log in to check your score instantly.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                onClick={() => router.push("/login?redirect=/ats-score")}
                                className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                                Log In to Account
                            </button>
                            <button
                                onClick={() => router.push("/login?mode=signup&redirect=/ats-score")}
                                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                            >
                                Create Free Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AtsScoreCheck;
