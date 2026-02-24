"use client";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
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
  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    if (!resumeId) return;
    const loadExistingResume = async () => {
      try {
        const { data } = await axiosInstance.get(`/resumes/get/${resumeId}`);
        console.log("data.resume", data.resume);

        if (data.resume) {
          setResumeData(data.resume);
          document.title = data.resume.title;
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    loadExistingResume();
  }, []);

  // Resume functionalities

  const changeResumeVisibility = async () => {
    try {
      setIsUpdatingVisibility(true);
      const formData = new FormData();
      formData.append("id", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public }),
      );
      const { data } = await axiosInstance.put(`/resumes/update`, formData);
      console.log("dataa", data);
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

  const handleSaveResume = async () => {
    try {
      setIsSaving(true);
      let updatedResumeData = structuredClone(resumeData);
      //remove image fromupdatedResumeData
      if (typeof resumeData.personalInfo.image === "object") {
        delete updatedResumeData.personalInfo.image;
      }
      const formData = new FormData();
      formData.append("id", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));
      removeBackground && formData.append("removeBackground", "yes");
      if (resumeData.personalInfo?.image instanceof File) {
        formData.append("image", resumeData.personalInfo.image);
      }

      const promise = axiosInstance.put(`/resumes/update`, formData);

      const { data } = await toast.promise(promise, {
        loading: "Saving...",
        success: (res) => res.data.message || "Saved successfully!",
        error: "Something went wrong",
      });

      setResumeData(data.data);
      // toast.success(data.message);
    } catch (error: any) {
      console.log("Error saving resume:", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadResumeAsPDF = async () => {
    window.print();
  };
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          href={"/dashboard"}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* left panel - form */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-violet-500 to-violet-600 border-none transition-all duration-2000"
                style={{
                  width: `${
                    (activeSectionIndex * 100) / (sections.length - 1)
                  }`,
                }}
              />
              {/* section nav */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1 ">
                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData?.template}
                    onChange={(template: any) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData?.accentColor}
                    onChange={(color: any) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accentColor: color,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prevIndex) =>
                          Math.max(prevIndex - 1, 0),
                        )
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) =>
                        Math.min(prevIndex + 1, sections.length - 1),
                      )
                    }
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1 && "opacity-50"
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
              {/* Form content */}
              <div className="space-y-6 ">
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
              <button
                onClick={handleSaveResume}
                disabled={isSaving}
                className={`relative flex items-center justify-center gap-2 text-sm rounded-md px-6 py-2 mt-6 transition-all 
                  ${isSaving ? "cursor-not-allowed" : ""} bg-gradient-to-br from-green-100 to-green-200 text-green-600 ring
                   ring-green-300 hover:ring-green-400`}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* right panel - preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
