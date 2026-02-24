import { Check, Layout } from "lucide-react";
import { useState } from "react";

type Template = {
  id: string;
  name: string;
  preview: string;
};

type TemplateSelectorProps = {
  selectedTemplate: string;
  onChange: (templateId: string) => void;
};

const TemplateSelector = ({
  selectedTemplate,
  onChange,
}: TemplateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates: Template[] = [
    {
      id: "classic",
      name: "Classic Template",
      preview:
        "A timeless, structured resume design that emphasizes clarity and professionalism across every section.",
    },
 {
      id: "atsFriendly",
      name: "ATS-Friendly Template",
      preview:
        "A clean, structured resume format optimized for Applicant Tracking Systems (ATS) to ensure your resume passes through automated screening processes.",
    },
    {
      id: "modern",
      name: "Modern Template",
      preview:
        "A bold, contemporary format with creative typography and smart layout choices that make your resume stand out.",
    },
    {
      id: "minimal",
      name: "Minimal Template",
      preview:
        "A crisp, distraction-free layout that highlights your experience and skills with perfect balance and whitespace.",
    },
    {
      id: "minimalImage",
      name: "Minimal with Image",
      preview:
        "A clean, elegant layout with room for a profile photo — ideal for professionals who want a personal yet polished touch.",
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-green-600 bg-gradient-to-br from-green-50 to-green-100 ring-green-300 hover:ring transition-all px-3 py-2 rounded-lg"
      >
        <Layout size={14} /> <span className="max-sm:hidden">Template</span>
      </button>
      {isOpen && (
        <div className="absolute top-full w-xs p-3 mt-2 space-y-3 z-10 bg-white rounded-md border border-gray-200 shadow-sm">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onChange(template.id);
                setIsOpen(false);
              }}
              className={`relative p-3 border rounded-md cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? "border-green-400 bg-green-100"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-100"
              }`}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <div className="size-5 bg-green-400 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <h4 className="font-medium text-gray-800">{template.name}</h4>
                <p className="mt-2 p-2 bg-green-50 rounded text-xs text-gray-500 italic">
                  {template.preview}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
