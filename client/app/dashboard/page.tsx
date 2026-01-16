'use client';
import {
  File,
  FilePenLineIcon,
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

const Dashboard = () => {
  const colors = ["#9333ea", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  const [allResumes, setAllResumes] = useState<any[]>([]);
  const [showCreatedResume, setShowCreatedResume] = useState<boolean>(false);
  const [showUploadResume, setShowUploadResume] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [resume, setResume] = useState<any>();
  const [editResumeId, setEditResumeId] = useState<any>(false);

  const router = useRouter();
  useEffect(() => {
    const loadAllResumes = async () => setAllResumes(dummyResumeData);
    loadAllResumes();
  }, []);

  const createResume = async (event: any) => {
    event.preventDefault();
    setShowCreatedResume(false);
    router.push("/dashboard/builder/res123");
  };

  const uploadResume = async (event: any) => {
    event.preventDefault();
    setShowUploadResume(false);
    router.push("/dashboard/builder/res123");
  };

  const editResumeTitle = async (event: any) => {
    event.preventDefault();
    router.push("/dashboard/builder/res123");
  };

  const deleteResume = async (ResumeId: any) => {
    setAllResumes((prev) => prev.filter((resume) => resume._id !== ResumeId));
    setShowConfirm(false);
  };

  return (
    <div>
      {showConfirm && selectedResume && (
        <ConfirmDelete
          title="Delete Resume?"
          description={`Are you sure you want to delete "${selectedResume?.title}"? This action cannot be undone.`}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          onConfirm={() => deleteResume(selectedResume._id)}
          onCancel={() => {
            setShowConfirm(false);
            setSelectedResume(null);
          }}
          type="danger"
        />
      )}
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
                onClick={() => router.push(`/dashboard/builder/${resume._id}`)}
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
                      setSelectedResume(resume);
                      setShowConfirm(true);
                      // deleteResume(resume._id)
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume._id);
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
              <button className="w-full py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors">
                Upload Resume
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
        {editResumeId && (
          <form
            onSubmit={editResumeTitle}
            onClick={() => setEditResumeId("")}
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
              <button className="w-full py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors">
                Update Resume
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId(false);
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
