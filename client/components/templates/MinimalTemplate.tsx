import React from "react";
import type { TemplateProps } from "./types"; 

const MinimalTemplate: React.FC<TemplateProps> = ({ data, accentColor }) => {
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "";

  // Case 1: "2025-04"
  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const [year, month] = dateStr.split("-");
    return new Date(
      Number(year),
      Number(month) - 1
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }

  // Case 2: "April 2025"
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  }

  return "";
};

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-thin mb-4 tracking-wide">
          {data?.personalInfo?.fullName || "Your Name"}
        </h1>

        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          {data?.personalInfo?.email && <span><a href={`mailto:${data?.personalInfo.email}`}>{data?.personalInfo.email}</a></span>}
          {data?.personalInfo?.phone && <span>{data?.personalInfo.phone}</span>}
          {data?.personalInfo?.location && <span>{data?.personalInfo.location}</span>}
          {data?.personalInfo?.linkedin && (
            <span className="break-all">
              <a href={data?.personalInfo.linkedin} target="_top">
                {data?.personalInfo.linkedin}
              </a>
            </span>
          )}
          {data?.personalInfo?.website && (
            <span className="break-all">
              <a href={data?.personalInfo.website} target="_blank">
                {data?.personalInfo.website}
              </a>
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data?.professionalSummary && (
        <section className="mb-10">
          <p className="text-gray-700">{data?.professionalSummary}</p>
        </section>
      )}

      {/* Experience */}
      {data?.workExperience && data?.workExperience.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Experience
          </h2>

          <div className="space-y-6">
            {data?.workExperience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-medium">{exp.position}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} -{" "}
                    {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{exp.company}</p>
                {exp.description && (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data?.projects && data?.projects.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Projects
          </h2>

          <div className="space-y-4">
            {data?.projects.map((proj, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 justify-between items-baseline"
              >
                <h3 className="text-lg font-medium">{proj.name}</h3>
                <p className="text-gray-600">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data?.education && data?.education.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Education
          </h2>

          <div className="space-y-4">
            {data?.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(edu.graduationDate)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data?.skills && data?.skills.length > 0 && (
        <section>
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: accentColor }}
          >
            Skills
          </h2>

          <div className="text-gray-700">{data?.skills.join(" • ")}</div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
