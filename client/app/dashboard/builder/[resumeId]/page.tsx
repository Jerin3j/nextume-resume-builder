"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeftIcon,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Loader2,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import TemplateSelector from "@/components/TemplateSelector";
import ColorPicker from "@/components/ColorPicker";
import PersonalInfoForm from "@/components/Forms/PersonalInfoForm";
import ProfessionalSummary from "@/components/Forms/ProfessionalSummary";
import Experience from "@/components/Forms/Experience";
import Education from "@/components/Forms/Education";
import Projects from "@/components/Forms/Projects";
import Skills from "@/components/Forms/Skills";
import ResumePreview from "@/components/ResumePreview";
import { useParams } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";
import toast from "react-hot-toast";

type ResumeData = {
  _id: string;
  title: string;
  personalInfo: Record<string, any>;
  professionalSummary: string;
  workExperience: any[];
  education: any[];
  projects: any[];
  skills: any[];
  template: string;
  accentColor: string;
  public: boolean;
};

const ResumeBuilder = () => {
  const { resumeId } = useParams<{ resumeId: string }>();

  const [resumeData, setResumeData] = useState<ResumeData>({
    _id: "",
    title: "",
    personalInfo: {},
    professionalSummary: "",
    workExperience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accentColor: "#3B82F6",
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved" | "error">("saved");
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("center");

  const formContainerRef = useRef<HTMLDivElement>(null);
  const shouldFocusFirstInputRef = useRef(false);
  const resumeDataRef = useRef<ResumeData>(resumeData);
  const lastSavedDataStringRef = useRef<string>("");
  const isInitialLoadedRef = useRef(false);
  const isDirtyRef = useRef(false);
  const isSavingRef = useRef(false);
  const pendingSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const removeBackgroundRef = useRef(removeBackground);

  resumeDataRef.current = resumeData;
  removeBackgroundRef.current = removeBackground;

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  // Helper to normalize data for dirty checking
  const normalizeComparable = (data: ResumeData): string => {
    const copy = {
      ...data,
      personalInfo: {
        ...data.personalInfo,
        image: typeof data.personalInfo?.image === "object" ? undefined : data.personalInfo?.image,
      },
    };
    return JSON.stringify(copy);
  };

  // Helper to persist draft to localStorage
  const saveToLocalStorage = (id: string, data: ResumeData) => {
    try {
      if (typeof window === "undefined" || !id) return;
      const copy = {
        ...data,
        personalInfo: {
          ...data.personalInfo,
          image: typeof data.personalInfo?.image === "object" ? undefined : data.personalInfo?.image,
        },
      };
      localStorage.setItem(`resume_draft_${id}`, JSON.stringify(copy));
    } catch (e) {
      console.warn("Could not save resume draft to localStorage", e);
    }
  };

  // Flush keepalive save during beforeunload
  const flushKeepAliveSave = useCallback(() => {
    try {
      if (!resumeId || !isDirtyRef.current) return;
      const currentData = resumeDataRef.current;
      const updatedResumeData = structuredClone(currentData);
      if (typeof updatedResumeData.personalInfo?.image === "object") {
        delete updatedResumeData.personalInfo.image;
      }
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const baseApiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
      const formData = new FormData();
      formData.append("id", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));
      if (removeBackgroundRef.current) {
        formData.append("removeBackground", "yes");
      }

      fetch(`${baseApiUrl}/resumes/update`, {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
        keepalive: true,
      });
    } catch (err) {
      console.error("Keepalive save error:", err);
    }
  }, [resumeId]);

  // Main save function supporting auto-save and manual save
  const saveResumeData = useCallback(
    async (isAutoSave = false): Promise<boolean> => {
      if (!resumeId || isSavingRef.current) return false;

      const currentData = resumeDataRef.current;
      const updatedResumeData = structuredClone(currentData);

      let imageFile: File | null = null;
      if (typeof currentData.personalInfo?.image === "object") {
        if (currentData.personalInfo.image instanceof File) {
          imageFile = currentData.personalInfo.image;
        }
        delete updatedResumeData.personalInfo.image;
      }

      const payloadString = JSON.stringify(updatedResumeData);
      if (
        !isDirtyRef.current &&
        !imageFile &&
        payloadString === lastSavedDataStringRef.current
      ) {
        setSaveStatus("saved");
        return true;
      }

      try {
        isSavingRef.current = true;
        setIsSaving(true);
        setSaveStatus("saving");

        const formData = new FormData();
        formData.append("id", resumeId);
        formData.append("resumeData", payloadString);
        if (removeBackgroundRef.current) {
          formData.append("removeBackground", "yes");
        }
        if (imageFile) {
          formData.append("image", imageFile);
        }

        if (isAutoSave) {
          // Silent background save without interrupting user
          const res = await axiosInstance.put("/resumes/update", formData);
          if (res.data?.data) {
            lastSavedDataStringRef.current = normalizeComparable(res.data.data);
            isDirtyRef.current = false;
            setSaveStatus("saved");
            saveToLocalStorage(resumeId, res.data.data);
            if (imageFile && res.data.data.personalInfo?.image) {
              setResumeData((prev) => ({
                ...prev,
                personalInfo: {
                  ...prev.personalInfo,
                  image: res.data.data.personalInfo.image,
                  imageSource: "existing",
                },
              }));
            }
          }
        } else {
          // Manual button save with toast notifications
          const promise = axiosInstance.put("/resumes/update", formData);
          const { data } = await toast.promise(promise, {
            loading: "Saving...",
            success: (res) => res.data?.message || "Saved successfully!",
            error: "Something went wrong while saving",
          });

          if (data?.data) {
            lastSavedDataStringRef.current = normalizeComparable(data.data);
            isDirtyRef.current = false;
            setSaveStatus("saved");
            setResumeData(data.data);
            saveToLocalStorage(resumeId, data.data);
          }
        }
        return true;
      } catch (error: any) {
        console.error("Error saving resume:", error);
        setSaveStatus("error");
        if (!isAutoSave) {
          toast.error(error?.response?.data?.message || "Error saving resume");
        }
        return false;
      } finally {
        isSavingRef.current = false;
        setIsSaving(false);
      }
    },
    [resumeId]
  );

  const handleSaveResume = () => saveResumeData(false);

  // Initial resume load
  useEffect(() => {
    if (!resumeId) return;
    const loadExistingResume = async () => {
      try {
        const { data } = await axiosInstance.get(`/resumes/get/${resumeId}`);
        if (data?.resume) {
          setResumeData(data.resume);
          lastSavedDataStringRef.current = normalizeComparable(data.resume);
          isDirtyRef.current = false;
          setSaveStatus("saved");
          isInitialLoadedRef.current = true;
          if (data.resume.title) {
            document.title = data.resume.title;
          }
        }
      } catch (error: any) {
        console.error("Error loading resume:", error.message);
        toast.error("Failed to load resume");
      }
    };
    loadExistingResume();
  }, [resumeId]);

  // Debounced auto-save on user edits
  useEffect(() => {
    resumeDataRef.current = resumeData;
    removeBackgroundRef.current = removeBackground;

    if (!isInitialLoadedRef.current || !resumeId) return;

    const currentComparable = normalizeComparable(resumeData);
    if (currentComparable !== lastSavedDataStringRef.current) {
      isDirtyRef.current = true;
      setSaveStatus("unsaved");
      saveToLocalStorage(resumeId, resumeData);

      if (pendingSaveTimeoutRef.current) {
        clearTimeout(pendingSaveTimeoutRef.current);
      }

      pendingSaveTimeoutRef.current = setTimeout(() => {
        saveResumeData(true);
      }, 1200);
    }

    return () => {
      if (pendingSaveTimeoutRef.current) {
        clearTimeout(pendingSaveTimeoutRef.current);
      }
    };
  }, [resumeData, resumeId, saveResumeData]);

  // Save when user navigates away within the application (unmount)
  useEffect(() => {
    return () => {
      if (isDirtyRef.current) {
        saveResumeData(true);
      }
    };
  }, [saveResumeData]);

  // Save when tab loses visibility or window is minimized
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isDirtyRef.current) {
        saveResumeData(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [saveResumeData]);

  // Save before unload (browser close / reload / navigate away)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isDirtyRef.current) {
        saveToLocalStorage(resumeId, resumeDataRef.current);
        flushKeepAliveSave();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [resumeId, flushKeepAliveSave]);

  // Handle Enter key to jump to the next input field
  const handleEnterNavigation = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter") return;
    if (e.defaultPrevented) return;

    const target = e.target as HTMLElement;
    if (!target) return;

    const tagName = target.tagName.toLowerCase();
    if (tagName === "textarea") {
      // In textarea, Enter creates a newline. Ctrl/Cmd+Enter jumps to next input.
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      } else {
        return;
      }
    } else if (tagName !== "input") {
      return;
    }

    if (target instanceof HTMLInputElement) {
      const type = target.type.toLowerCase();
      if (["checkbox", "radio", "file", "button", "submit", "reset"].includes(type)) {
        return;
      }
    }

    e.preventDefault();

    const container = formContainerRef.current;
    if (!container) return;

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'input:not([type="hidden"]):not([type="file"]):not([type="checkbox"]):not([type="radio"]):not([disabled]), textarea:not([disabled]), select:not([disabled])'
      )
    ).filter((el) => {
      return el.offsetParent !== null && !el.hasAttribute("disabled") && !el.classList.contains("hidden");
    });

    const currentIndex = focusable.indexOf(target);

    if (currentIndex > -1 && currentIndex < focusable.length - 1) {
      const nextEl = focusable[currentIndex + 1];
      nextEl.focus();
      if ("select" in nextEl && typeof (nextEl as HTMLInputElement).select === "function") {
        (nextEl as HTMLInputElement).select();
      }
      nextEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else if (currentIndex === focusable.length - 1) {
      // If at the end of the section, advance to next section if available
      if (activeSectionIndex < sections.length - 1) {
        shouldFocusFirstInputRef.current = true;
        setActiveSectionIndex((prev) => prev + 1);
      }
    }
  };

  // Auto-focus first input when navigating sections via Enter
  useEffect(() => {
    if (shouldFocusFirstInputRef.current) {
      shouldFocusFirstInputRef.current = false;
      const timer = setTimeout(() => {
        const container = formContainerRef.current;
        if (!container) return;
        const firstFocusable = container.querySelector<HTMLElement>(
          'input:not([type="hidden"]):not([type="file"]):not([type="checkbox"]):not([type="radio"]):not([disabled]), textarea:not([disabled]), select:not([disabled])'
        );
        if (firstFocusable) {
          firstFocusable.focus();
          if ("select" in firstFocusable && typeof (firstFocusable as HTMLInputElement).select === "function") {
            (firstFocusable as HTMLInputElement).select();
          }
          firstFocusable.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [activeSectionIndex]);

  // Resume visibility toggle
  const changeResumeVisibility = async () => {
    try {
      setIsUpdatingVisibility(true);
      const formData = new FormData();
      formData.append("id", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public })
      );
      const { data } = await axiosInstance.put(`/resumes/update`, formData);
      setResumeData({ ...resumeData, public: !resumeData.public });
      toast.success(data.message);
    } catch (error: any) {
      console.log("Error saving resume:", error.message);
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  const handleShareResume = async () => {
    const frontendUrl = window.location.href.split("/dashboard/")[0];
    const resumeUrl = `${frontendUrl}/view/${resumeId}`;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" });
    } else {
      alert("Share not supported in this browser. Copy the link");
    }
  };

  const downloadResumeAsPDF = async () => {
    window.print();
  };

  return (
    <div>
      {/* Top Header bar with Back button and Auto-Save Status */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link
          href={"/dashboard"}
          onClick={() => {
            if (isDirtyRef.current) {
              saveResumeData(true);
            }
          }}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-all font-medium text-sm"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>

        {/* Real-time Save Status Pill */}
        <div className="flex items-center gap-2 text-xs font-medium">
          {saveStatus === "saving" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-sm animate-pulse">
              <Loader2 className="size-3 animate-spin text-amber-600" />
              Saving changes...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
              <Check className="size-3.5 text-emerald-600" />
              All changes saved
            </span>
          )}
          {saveStatus === "unsaved" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-200 shadow-sm">
              <Clock className="size-3 text-slate-400" />
              Unsaved changes
            </span>
          )}
          {saveStatus === "error" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 shadow-sm">
              Auto-save failed
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* left panel - form */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div
              ref={formContainerRef}
              onKeyDown={handleEnterNavigation}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1"
            >
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-violet-500 to-violet-600 border-none transition-all duration-2000"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />
              {/* section nav */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData?.template}
                    onChange={(template: any) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />
                  {resumeData?.template !== "atsFriendly" && (
                    <ColorPicker
                      selectedColor={resumeData?.accentColor}
                      onChange={(color: any) =>
                        setResumeData((prev) => ({
                          ...prev,
                          accentColor: color,
                        }))
                      }
                    />
                  )}
                </div>
                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() => {
                        if (isDirtyRef.current) {
                          saveResumeData(true);
                        }
                        setActiveSectionIndex((prevIndex) =>
                          Math.max(prevIndex - 1, 0)
                        );
                      }}
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (isDirtyRef.current) {
                        saveResumeData(true);
                      }
                      setActiveSectionIndex((prevIndex) =>
                        Math.min(prevIndex + 1, sections.length - 1)
                      );
                    }}
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1 ? "opacity-50" : ""
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
              {/* Form content */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <div>
                    <PersonalInfoForm
                      data={resumeData?.personalInfo}
                      onChange={(data) =>
                        setResumeData((prev) => ({
                          ...prev,
                          personalInfo: data,
                        }))
                      }
                      removeBackground={removeBackground}
                      setRemoveBackground={setRemoveBackground}
                    />
                  </div>
                )}
                {activeSection.id === "summary" && (
                  <ProfessionalSummary
                    data={resumeData.professionalSummary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professionalSummary: data,
                      }))
                    }
                  />
                )}
                {activeSection.id === "experience" && (
                  <Experience
                    data={resumeData?.workExperience}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        workExperience: data,
                      }))
                    }
                  />
                )}
                {activeSection.id === "education" && (
                  <Education
                    data={resumeData?.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: data,
                      }))
                    }
                  />
                )}
                {activeSection.id === "projects" && (
                  <Projects
                    data={resumeData?.projects}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        projects: data,
                      }))
                    }
                  />
                )}
                {activeSection.id === "skills" && (
                  <Skills
                    data={resumeData?.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: data,
                      }))
                    }
                  />
                )}
              </div>

              {/* Action and Save Area */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={handleSaveResume}
                  disabled={isSaving}
                  className={`relative flex items-center justify-center gap-2 text-sm rounded-md px-6 py-2 transition-all 
                    ${isSaving ? "cursor-not-allowed opacity-80" : ""} bg-gradient-to-br from-green-100 to-green-200 text-green-700 ring
                     ring-green-300 hover:ring-green-400 font-medium`}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>

                <div className="flex items-center text-xs">
                  {saveStatus === "saving" && (
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <Loader2 className="size-3.5 animate-spin" /> Auto-saving...
                    </span>
                  )}
                  {saveStatus === "saved" && (
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <Check className="size-3.5" /> All changes saved
                    </span>
                  )}
                  {saveStatus === "unsaved" && (
                    <span className="flex items-center gap-1.5 text-slate-400">
                      Unsaved changes
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* right panel - preview */}
          <div className="flex lg:col-span-7 max-lg:mt-6 gap-1">
            <div className="flex flex-col flex-1 relative">
              <div className="relative w-full">
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                  {/* --- resume buttons --- */}
                  {resumeData?.public && (
                    <button
                      onClick={handleShareResume}
                      className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                    >
                      <Share2Icon className="size-4" /> Share
                    </button>
                  )}
                  <button
                    onClick={changeResumeVisibility}
                    disabled={isUpdatingVisibility}
                    className="relative flex items-center justify-center p-2 px-4 gap-2 text-xs 
                             bg-gradient-to-br from-purple-100 to-purple-200 
                             text-purple-600 ring-purple-300 rounded-lg 
                             hover:ring transition-all duration-300
                             disabled:cursor-not-allowed"
                  >
                    {isUpdatingVisibility ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded shimmer" />
                        <div className="h-2 w-8 rounded shimmer" />
                      </div>
                    ) : (
                      <>
                        {resumeData?.public ? (
                          <EyeIcon className="size-4 transition-opacity duration-200" />
                        ) : (
                          <EyeOffIcon className="size-4 transition-opacity duration-200" />
                        )}
                        <span>{resumeData?.public ? "Public" : "Private"}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadResumeAsPDF}
                    className="flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors"
                  >
                    <DownloadIcon className="size-4" /> Download PDF
                  </button>
                </div>
              </div>
              {/* --- resume preview --- */}
              <ResumePreview
                data={resumeData}
                accentColor={resumeData?.accentColor}
                template={resumeData?.template}
                alignment={alignment}
              />
            </div>
            {/* resume header alignment selector */}
            {resumeData?.template !== "minimalImage" && (
              <div className="h-32 w-10 rounded-lg border-2 border-slate-300 bg-slate-100 flex flex-col items-center justify-center mt-3 gap-4 p-2">
                <button onClick={() => setAlignment("left")}>
                  <AlignLeft
                    size={18}
                    className={`transition-colors ${
                      alignment === "left"
                        ? "text-slate-900"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  />
                </button>

                <button onClick={() => setAlignment("center")}>
                  <AlignCenter
                    size={18}
                    className={`transition-colors ${
                      alignment === "center"
                        ? "text-slate-900"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  />
                </button>

                <button onClick={() => setAlignment("right")}>
                  <AlignRight
                    size={18}
                    className={`transition-colors ${
                      alignment === "right"
                        ? "text-slate-900"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
