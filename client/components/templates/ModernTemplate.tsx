import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import type { TemplateProps } from "./types";

const ModernTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor,
  alignment,
}) => {
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";

    // Case 1: "2025-04"
    if (/^\d{4}-\d{2}$/.test(dateStr)) {
      const [year, month] = dateStr.split("-");
      return new Date(Number(year), Number(month) - 1).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
        },
      );
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
    <div className="max-w-4xl mx-auto bg-white text-gray-800">
      {/* Header */}
      <header
        className={`p-8 text-white flex flex-col ${
          alignment === "left"
            ? "items-start text-left"
            : alignment === "right"
              ? "items-end text-right"
              : "items-center text-center"
        }`}
        style={{ backgroundColor: accentColor }}
      >
        <h1 className="text-4xl font-light mb-3">
          {data?.personalInfo?.fullName || "Your Name"}
        </h1>

        <div
          className={`text-sm w-full ${
            alignment === "left"
              ? "grid gap-2 justify-items-start grid-cols-1 sm:grid-cols-2"
              : alignment === "right"
                ? "grid gap-2 justify-items-end grid-cols-1 sm:grid-cols-2"
                : "flex flex-wrap justify-center gap-x-6 gap-y-2"
          }`}
        >
          {data?.personalInfo?.email && (
            <a
              href={`mailto:${data.personalInfo.email}`}
              className="flex items-center gap-2 break-all"
            >
              <Mail className="size-4" />
              <span>{data.personalInfo.email}</span>
            </a>
          )}

          {data?.personalInfo?.phone && (
            <a
              href={`tel:${data.personalInfo.phone}`}
              className="flex items-center gap-2"
            >
              <Phone className="size-4" />
              <span>{data.personalInfo.phone}</span>
            </a>
          )}

          {data?.personalInfo?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
          {data?.personalInfo?.linkedin && (
            <a
              href={
                data.personalInfo.linkedin.startsWith("http")
                  ? data.personalInfo.linkedin
                  : `https://${data.personalInfo.linkedin}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Linkedin className="size-4" />
              <span className="text-xs">
                {data.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            </a>
          )}

          {data?.personalInfo?.website && (
            <a
              href={
                data.personalInfo.website.startsWith("http")
                  ? data.personalInfo.website
                  : `https://${data.personalInfo.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 break-all"
            >
              <Globe className="size-4" />
              <span className="text-xs">
                {data.personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            </a>
          )}
        </div>
      </header>

      <div className="p-8">
        {/* Professional Summary */}
        {data?.professionalSummary && (
          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
              Professional Summary
            </h2>
            <p className="text-gray-700">{data?.professionalSummary}</p>
          </section>
        )}

        {/* Experience */}
        {data?.workExperience && data?.workExperience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-light mb-6 pb-2 border-b border-gray-200">
              Experience
            </h2>

            <div className="space-y-6">
              {data?.workExperience.map((exp, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-medium text-gray-900">
                        {exp.position}
                      </h3>
                      <p className="font-medium" style={{ color: accentColor }}>
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 leading-relaxed mt-3 whitespace-pre-line">
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
          <section className="mb-8">
            <h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
              Projects
            </h2>

            <div className="space-y-6">
              {data?.projects.map((p, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l border-gray-200"
                  style={{ borderLeftColor: accentColor }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">
                      {p.name}
                    </h3>
                  </div>
                  {p.description && (
                    <div className="text-gray-700 leading-relaxed text-sm mt-3">
                      {p.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid sm:grid-cols-2 gap-8">
          {/* Education */}
          {data?.education && data?.education.length > 0 && (
            <section>
              <h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
                Education
              </h2>

              <div className="space-y-4">
                {data?.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p style={{ color: accentColor }}>{edu.institution}</p>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>{formatDate(edu.graduationDate)}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data?.skills && data?.skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
                Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {data?.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm text-white rounded-full"
                    style={{ backgroundColor: accentColor }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
