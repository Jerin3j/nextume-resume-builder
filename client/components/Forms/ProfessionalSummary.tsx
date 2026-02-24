import axiosInstance from "@/app/utils/axiosInstance";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type ProfessionalSummaryProps = {
  data: string;
  onChange: (value: string) => void;
};

const ProfessionalSummary = ({ data, onChange }: ProfessionalSummaryProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    if (!data?.trim()) {
      toast.error("Please write something before enhancing.");
      return;
    }

    try {
      setIsGenerating(true);

      const prompt = `Enhance my professional summary: "${data}"`;

      const response = await axiosInstance.post("/ai/enhance-summary", {
        userContext: prompt,
      });

      const enhancedContent = response?.data?.enhancedContent;

      if (!enhancedContent) {
        toast.error("Failed to enhance summary.");
        return;
      }

      // Update parent state (controlled component)
      onChange(enhancedContent);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Add summary for your resume here
          </p>
        </div>

        <button
          type="button"
          disabled={isGenerating}
          onClick={generateSummary}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {isGenerating ? "Enhancing..." : "AI Enhance"}
        </button>
      </div>

      <div className="mt-6">
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          disabled={isGenerating}
          className={`w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${isGenerating ? "opacity-70 cursor-not-allowed blur-[1px] animate-pulse" : "text-gray-900"}`}
          placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
        />

        <p className="text-xs text-gray-500 max-w-[80%] mx-auto text-center mt-2">
          Tip: Keep it concise (3–4 sentences) and focus on your most relevant
          achievements and skills.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummary;
