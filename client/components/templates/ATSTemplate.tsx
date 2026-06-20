import React from "react";
import type { TemplateProps } from "./types";

const ATSTemplate: React.FC<TemplateProps> = ({ data, alignment }) => {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";

    if (/^\d{4}-\d{2}$/.test(dateStr)) {
      const [year, month] = dateStr.split("-");
      return new Date(Number(year), Number(month) - 1).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "short" },
      );
    }

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
    <div className="max-w-3xl mx-auto p-8 bg-white text-black text-sm leading-relaxed">
      {/* Header */}
      <div
        className={`mb-6 flex flex-col ${
          alignment === "left"
            ? "items-start text-left"
            : alignment === "right"
              ? "items-end text-right"
              : "items-center text-center"
        }`}
      >
        <h1 className="text-2xl font-bold">{data?.personalInfo?.fullName}</h1>

        {data?.personalInfo?.profession && (
          <p className="text-sm text-gray-600 mb-2">
            {data.personalInfo.profession}
          </p>
        )}

        <p>
          {data?.personalInfo?.email && (
            <>
              <a href={`mailto:${data.personalInfo.email}`}>
                {data.personalInfo.email}
              </a>
            </>
          )}

          {data?.personalInfo?.phone && (
            <>
              {" | "}
              <a href={`tel:${data.personalInfo.phone}`}>
                {data.personalInfo.phone}
              </a>
            </>
          )}

          {data?.personalInfo?.location && (
            <>
              {" | "}
              {data.personalInfo.location}
            </>
          )}
        </p>

        {(data?.personalInfo?.linkedin || data?.personalInfo?.website) && (
          <p>
            {data?.personalInfo?.linkedin && (
              <a
                href={
                  data.personalInfo.linkedin.startsWith("http")
                    ? data.personalInfo.linkedin
                    : `https://${data.personalInfo.linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.personalInfo.linkedin}
              </a>
            )}

            {data?.personalInfo?.website && (
              <>
                {" | "}
                <a
                  href={
                    data.personalInfo.website.startsWith("http")
                      ? data.personalInfo.website
                      : `https://${data.personalInfo.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.personalInfo.website}
                </a>
              </>
            )}
          </p>
        )}
      </div>

      {/* Professional Summary */}
      {data?.professionalSummary && (
        <div className="mb-6">
          <h2 className="font-bold uppercase mb-2">Professional Summary</h2>
          <p>{data.professionalSummary}</p>
        </div>
      )}

      {/* Experience */}
      {data?.workExperience && data?.workExperience?.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold uppercase mb-2">Professional Experience</h2>

          {data?.workExperience &&
            data.workExperience.map((exp, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold">
                  {exp.position} | {exp.company}
                </p>

                <p className="text-gray-700">
                  {formatDate(exp.startDate)} •{" "}
                  {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                </p>

                {exp.description &&
                  exp.description
                    .split("\n")
                    .map((line, i) => <p key={i}>• {line}</p>)}
              </div>
            ))}
        </div>
      )}

      {/* Projects */}
      {data?.projects && data?.projects?.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold uppercase mb-2">Projects</h2>

          {data.projects &&
            data.projects.map((proj, index) => (
              <div key={index} className="mb-3">
                <p className="font-semibold">{proj.name}</p>
                <p>• {proj.description}</p>
              </div>
            ))}
        </div>
      )}

      {/* Education */}
      {data?.education && data?.education?.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold uppercase mb-2">Education</h2>

          {data.education &&
            data.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <p className="font-semibold">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </p>
                <p>{edu.institution}</p>
                <p>{formatDate(edu.graduationDate)}</p>
                {edu.gpa && <p>GPA: {edu.gpa}</p>}
              </div>
            ))}
        </div>
      )}

      {/* Skills */}
      {data?.skills && data?.skills?.length > 0 && (
        <div>
          <h2 className="font-bold uppercase mb-2">Skills</h2>

          <p>{data.skills.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default ATSTemplate;
