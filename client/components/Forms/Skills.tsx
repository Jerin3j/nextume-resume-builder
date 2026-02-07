import { Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { allSkills } from "../../assets/allSkills";

type SkillsProps = {
  data: any;
  onChange: (value: any) => void;
};
const Skills = ({ data, onChange }: SkillsProps) => {
  const [newSkill, setNewSkill] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<any[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const addSkill = (skillToAdd?: string) => {
    const skill = (skillToAdd || newSkill).trim();
    if (skill && !data.includes(skill)) {
      onChange([...data, skill]);
      setNewSkill("");
      setFilteredSkills([]);
      setHighlightedIndex(-1);
    }
  };

  const removeSkill = (indexToRemove: number) => {
    onChange(data.filter((_: any, index: number) => index !== indexToRemove));
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredSkills.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSkills.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        addSkill(filteredSkills[highlightedIndex].label);
      } else {
        addSkill();
      }
    }
  };

  const handleInputChange = (value: string) => {
    setNewSkill(value);
    if (value.trim().length > 0) {
      const filtered = allSkills.filter((skill) =>
        skill.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  };
  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          Skills
        </h3>
        <p className="text-sm text-gray-500">
          Add your technical and soft skills{" "}
        </p>
      </div>
      <div className="relative w-full">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter a skill (e.g., Communication, JavaScript"
            className="flex-1 px-3 py-2 text-sm"
            onChange={(e) => handleInputChange(e.target.value)}
            value={newSkill}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={() => addSkill()}
            disabled={!newSkill.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="size-4" /> Add
          </button>
          <ul className="absolute top-full left-0 w-full z-50 mt-1 bg-black/25 rounded-lg shadow-lg">
            <li className="p-0">
              {filteredSkills.length > 0 && (
                <ul className="absolute left-0 right-[90px] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-48 overflow-y-auto">
                  {filteredSkills.map((skill, index) => (
                    <li
                      key={index}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => {
                        setNewSkill(skill.label);
                        setFilteredSkills([]);
                      }}
                      className={`
                         px-4 py-2 text-sm cursor-pointer
                         ${
                           highlightedIndex === index
                             ? "bg-blue-100 text-blue-700"
                             : "hover:bg-blue-50"
                         }
                       `}
                    >
                      {skill.label}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>

      {data?.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {data?.map((skill: any, index: number) => (
            <span
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="text-blue-500 hover:text-blue-700 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3 " />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <Sparkles className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p>No skills added yet.</p>
          <p className="text-sm">Add your technical and soft skills above.</p>
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong>
          Add 8-12 relevent skills. Include both technical skills (programming
          languages, tools) and soft skills(leadership, communication).
        </p>
      </div>
    </div>
  );
};

export default Skills;
