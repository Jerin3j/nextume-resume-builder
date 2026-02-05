import { GraduationCap, Plus, Trash2 } from "lucide-react";

type EducationProps = {
  data: any;
  onChange: (value: any) => void;
};

const Education = ({ data, onChange }: EducationProps) => {
  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (index: number) => {
    const updated = data.filter((_: any, i: any) => i !== index);
    onChange(updated);
  };
  const updateEducation = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Education
          </h3>
          <p className="text-sm text-gray-500">
            Add your education details here
          </p>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
        >
          <Plus className="space-4" />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No education added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education: any, index: any) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4>Education #{index + 1}</h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="transition-colors text-red-500 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {/* Institution name */}
                <input
                  type="text"
                  value={education.institution || ""}
                  onChange={(e) =>
                    updateEducation(index, "institution", e.target.value)
                  }
                  placeholder="Institution Name"
                  className="px-3 py-2 text-sm"
                />
                {/* Degree */}
                <input
                  type="text"
                  value={education.degree || ""}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  placeholder="Degree (e.g., Bachelor's, Master's"
                  className="px-3 py-2 text-sm"
                />
                {/* Field */}
                <input
                  type="text"
                  value={education.field || ""}
                  placeholder="Field of Study"
                  onChange={(e) =>
                    updateEducation(index, "field", e.target.value)
                  }
                  className="px-3 py-2 text-sm"
                />
                {/* Graduation date */}
                <input
                  type="month"
                  value={education.graduationDate || ""}
                  onChange={(e) =>
                    updateEducation(index, "graduationDate", e.target.value)
                  }
                  className="px-3 py-2 text-sm"
                />
              </div>

              {/*  GPA */}
              <input
                type="text"
                value={education.gpa || ""}
                placeholder="GPA (optional)"
                onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                className="px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Education;
