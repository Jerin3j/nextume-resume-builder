import axiosInstance from "@/app/utils/axiosInstance";
import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type ExperienceProps = {
  data: any;
  onChange: (value: any) => void;
};
const Experience = ({ data, onChange }: ExperienceProps) => {

  const [generatingIndex, setGeneratingIndex] = useState(-1);
  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index: number) => {
    const updated = data.filter((_: any, i: any) => i !== index);
    onChange(updated);
  };
  const updateExperience = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const generateDescription = async( index: number) => {
    setGeneratingIndex(index);
    const experience = data[index];
    const prompt = `enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}.`

    try{
      const {data} = await axiosInstance.post('/ai/enhance-description', {userContext: prompt})
      updateExperience(index, "description", data.enhancedContent)
    }catch(error:any){
      toast.error(error?.response?.data?.message || error.message)
    }finally{
      setGeneratingIndex(-1);
    }
  }

  const toMonthInputValue = (value?: string): string => {
    if (!value) return "";

    // Already valid: YYYY-MM
    if (/^\d{4}-\d{2}$/.test(value)) {
      return value;
    }

    // "April 2025"
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}`;
    }

    return "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Professional Experience
          </h3>
          <p className="text-sm text-gray-500">
            Add your job experience details here
          </p>
        </div>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
        >
          <Plus className="space-4" />
          Add Experience
        </button>
      </div>

      {data?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.map((workExperience: any, index: any) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4>Experience #{index + 1}</h4>
                <button
                  onClick={() => removeExperience(index)}
                  className="transition-colors text-red-500 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {/* Company name */}
                <input
                  type="text"
                  value={workExperience.company || ""}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  placeholder="Company Name"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                {/* Position / Job title */}
                <input
                  type="text"
                  value={workExperience.position || ""}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm rounded-lg"
                />
                {/* Start date */}
                <input
                  type="month"
                  value={toMonthInputValue(workExperience?.startDate) || ""}
                  onChange={(e) =>
                    updateExperience(index, "startDate", e.target.value)
                  }
                  className="px-3 py-2 text-sm rounded-lg"
                />
                {/* End date */}
                <input
                  type="month"
                  value={toMonthInputValue(workExperience?.endDate) || ""}
                  onChange={(e) =>
                    updateExperience(index, "endDate", e.target.value)
                  }
                  disabled={workExperience.isCurrent}
                  className="px-3 py-2 text-sm rounded-lg disabled:bg-gray-100"
                />
              </div>
              {/* Currently working or not*/}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={workExperience.isCurrent || false}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "isCurrent",
                      e.target.checked ? true : false,
                    )
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Currently working here
                </span>
              </label>
              {/* Job description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Job Description
                  </label>
                  <button onClick={()=> generateDescription(index)} disabled={generatingIndex === index || !workExperience.position || !workExperience.company} className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50">
                   {generatingIndex === index ? (
                    <Loader2 className="w-3 h-3 animate-spin"/>
                   ) : (
                    <Sparkles className="w-3 h-3" />
                   )}
                    Enhance with AI
                  </button>
                </div>

                <textarea
                  value={workExperience.description || ""}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  rows={4}
                  disabled={generatingIndex === index}
                  placeholder="Describe your key responsibilities and achievements.."
                  className={`w-full text-sm py-2 px-3 rounded-lg resize-none ${generatingIndex === index ? "opacity-80 cursor-not-allowed blur-[1px] animate-pulse" : "text-gray-900"}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experience;
