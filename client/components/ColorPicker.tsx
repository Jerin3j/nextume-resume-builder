import { Check, Palette } from "lucide-react";
import { useState } from "react";

type ColorPickerProps = {
  selectedColor: string;
  onChange: (templateId: string) => void;
};

const ColorPicker = ({ selectedColor, onChange }: ColorPickerProps) => {
  const colors = [
    { name: "black", value: "#000000" },
    { name: "gray", value: "#6B7280" },
    { name: "blue", value: "#2563EB" },
    { name: "navy", value: "#1E3A8A" },
    { name: "indigo", value: "#4F46E5" },
    { name: "purple", value: "#7C3AED" },
    { name: "violet", value: "#8B5CF6" },
    { name: "teal", value: "#0D9488" },
    { name: "green", value: "#16A34A" },
    { name: "emerald", value: "#059669" },
    { name: "cyan", value: "#06B6D4" },
    { name: "red", value: "#DC2626" },
    { name: "rose", value: "#E11D48" },
    { name: "orange", value: "#EA580C" },
    { name: "amber", value: "#F59E0B" },
    { name: "yellow", value: "#EAB308" },
    { name: "brown", value: "#92400E" },
    { name: "slate", value: "#475569" },
    { name: "zinc", value: "#52525B" },
    { name: "white", value: "#FFFFFF" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg"
      >
        <Palette size={16} /> <span className="max-sm">Theme</span>
      </button>
      {isOpen && (
        <div className="grid grid-cols-4 w-60 gap-3 absolute top-full left-0 right-0 p-3 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-sm">
          {colors.map((color) => (
            <div
              key={color.value}
              className="relative cursor-pointergroup flex flex-col"
              onClick={() => {
                onChange(color.value);
                setIsOpen(!isOpen);
              }}
            >
              <div
                className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors"
                style={{ backgroundColor: color.value }}
              ></div>
              {selectedColor === color.value && (
                <div className="absolute top-0 left-0 right-0 bottom-4.5 flex items-center justify-center">
                  <Check className="size-5 text-white" />
                </div>
              )}
              <p className="text-xs text-center mt-1 text-gray-600">
                {color.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
