"use client";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, Loader } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ResumePreview from "@/components/ResumePreview";
import axiosInstance from "@/app/utils/axiosInstance";

const Preview = () => {
  const { resumeId } = useParams<{ resumeId: string }>();

  const [resumeData, setResumeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const data = await axiosInstance.get(`/resumes/public/${resumeId}`);
        if (data.data?.resume) {
          setResumeData(data.data.resume);
          if (data.data.resume.title) {
            document.title = data.data.resume.title;
          }
        }
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadResume();
  }, [resumeId]);

  return resumeData ? (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto py-10 px-4">
        <ResumePreview
          data={resumeData}
          accentColor={resumeData.accentColor || resumeData.accent_color || "#3B82F6"}
          template={resumeData.template || "classic"}
          classes="py-4 bg-white shadow-md rounded-lg"
        />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader className="size-8 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-center text-4xl md:text-6xl text-slate-400 font-medium">
            Resume not found
          </p>
          <Link
            href="/"
            className="mt-6 bg-violet-500 hover:bg-violet-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-violet-400 flex items-center transition-colors text-sm"
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Go to Home Page
          </Link>
        </div>
      )}
    </div>
  );
};

export default Preview;
