"use client";
import {
  File,
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dummyResumeData } from "@/assets/assets";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

const Dashboard = () => {
  const colors = ["#9333ea", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  const [allResumes, setAllResumes] = useState<any[]>([]);
  const [showCreatedResume, setShowCreatedResume] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showUploadResume, setShowUploadResume] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [resume, setResume] = useState<any>();
  const [editResumeId, setEditResumeId] = useState<string | null>(null);

  const router = useRouter();
  const { user, loading } = useSelector(
    (state: RootState) => state.authReducer,
  );

  useEffect(() => {
    const loadAllResumes = async () => {
      try {
        const resumes = await axiosInstance.get("/users/resumes");
        setAllResumes(resumes.data.resumes);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };
    loadAllResumes();
  }, []);

  //create new resume handler
  const createResume = async (event: any) => {
    try {
      event.preventDefault();
      const { data } = await axiosInstance.post("/resumes/create", { title });
      setAllResumes([...allResumes, data]);
      setTitle("");
      setShowCreatedResume(false);
      router.push(`/dashboard/builder/${data.resume?.id}`);
    } catch (error: any) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  // upload resume handler
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
      router.push(`/dashboard/builder/${data.resumeId}`);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response.data.message || "Something went wrong");
    }
    setShowUploadResume(false);
    // router.push(`/dashboard/builder/${data.resumeId}`);
  };

  //edit resume title handler
  const editResumeTitle = async (event: any) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      const { data } = await axiosInstance.put("/resumes/update", {
        id: editResumeId,
        resumeData: { title },
      });
      // Update local state
      setAllResumes(
        allResumes.map((resume) =>
          resume.id === editResumeId ? { ...resume, title } : resume,
        ),
      );
      setTitle("");
      setEditResumeId(null);

      toast.success(data.message);
      // router.push(`/dashboard/builder/${data.resumeId}`);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  //delete resume handler
  const deleteResume = async (resumeId: string, resumeTitle: string) => {
    // Show confirmation toast
    toast((t) => (
      <span className="flex flex-col gap-2">
        Are you sure you want to delete this "{resumeTitle}"?
        <div className="flex gap-2 mt-1">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={async () => {
              try {
                // Call backend to delete
                const { data } = await axiosInstance.delete(
                  `/resumes/delete/${resumeId}`,
                );

                // Update local state
                setAllResumes(
                  allResumes.filter((resume) => resume.id !== resumeId),
                );

                // Close the toast
                toast.dismiss(t.id);
                toast.success(data.message);
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
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </span>
    ));
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, Jerin J
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreatedResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-r from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>
          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-r from-violet-300 to-violet-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Upload Existing
            </p>
          </button>
        </div>
        <hr className="border-slate-300 my-6 sm:w-[305px]" />
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              <button
                onClick={() => router.push(`/dashboard/builder/${resume.id}`)}
                key={index}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 bprder group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + "40",
                }}
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />
                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>
                <p
                  className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                  style={{ color: baseColor + "90" }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 items-center hidden group-hover:flex"
                >
                  <TrashIcon
                    onClick={() => {
                      deleteResume(resume.id, resume.title);
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume.id);
                      setTitle(resume.title);
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>
        {showCreatedResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreatedResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 focus:border-violet-600 ring-violet-600"
                required
              />
              <button className="w-full py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors">
                Create Resume
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
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 focus:border-violet-600 ring-violet-600"
                required
              />
              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-slate-700"
                >
                  Select Resume File
                </label>
                <label
                  htmlFor="resume-input"
                  className="border bg-white rounded-md text-sm w-80 border-indigo-600/60 p-8 my-4 flex flex-col items-center gap-4  cursor-pointer hover:border-indigo-500 transition"
                >
                  {resume ? (
                    <>
                      <File className="size-11 text-violet-700" />

                      <p className="text-violet-500">{resume.name}</p>
                    </>
                  ) : (
                    <>
                      <UploadCloudIcon className="size-11 text-violet-700" />
                      <p className="text-gray-500">
                        Drag & drop your resume here
                      </p>
                      <p className="text-gray-400">
                        Or{" "}
                        <span className="text-violet-500 underline">click</span>{" "}
                        to upload
                      </p>
                    </>
                  )}
                  <input
                    onChange={(e: any) => setResume(e.target.files[0])}
                    id="resume-input"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                  />
                </label>
              </div>
              <button
                disabled={isLoading}
                className="w-full py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <LoaderCircleIcon className="animate-spin size-4 text-white" />
                )}
                {isLoading ? "Uploading.." : "Upload Resume"}
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {/* edit resume title */}
        {editResumeId !== null && (
          <form
            onSubmit={editResumeTitle}
            onClick={() => setEditResumeId(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 focus:border-violet-600 ring-violet-600"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <LoaderCircleIcon className="animate-spin size-4 text-white" />
                )}
                {isLoading ? "Updating..." : "Update Resume"}
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
      </div>
    </div>
  );
};

export default Dashboard;
