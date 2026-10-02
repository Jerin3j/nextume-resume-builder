import prisma from "../prismaClient.js";
import ai from "../configs/ai.js";
import { v4 as uuid } from "uuid";

export const parseAndSaveResume = async (userId: number, title: string, resumeText: string) => {
    const systemPrompt = "You are an expert AI Agent to extract data from resume into strict JSON format.";
    const userPrompt = `Extract structured data from the following resume text:
${resumeText}

Provide your response strictly in the following valid JSON format with no additional text or markdown formatting:
{
  "public": false,
  "template": "classic",
  "accentColor": "#3B82F6",
  "professionalSummary": "A brief summary extracted from resume",
  "skills": ["Skill 1", "Skill 2"],
  "personalInfo": {
    "image": "",
    "fullName": "Full Name",
    "profession": "Profession/Role",
    "email": "email@example.com",
    "phone": "Phone Number",
    "location": "City, Country",
    "linkedin": "LinkedIn URL",
    "website": "Portfolio/Website URL"
  },
  "workExperience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Start Date",
      "endDate": "End Date or Present",
      "description": "Key responsibilities and achievements",
      "isCurrent": false
    }
  ],
  "education": [
    {
      "institution": "University/School Name",
      "degree": "Degree",
      "field": "Field of Study",
      "graduationDate": "Graduation Date",
      "gpa": "GPA if mentioned"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project Description",
      "type": "Project Type (e.g. Full-Stack)"
    }
  ]
}
`;

    const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL!,
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: userPrompt,
            },
        ],
        response_format: { type: "json_object" },
    });

    const message = response.choices[0]?.message;
    if (!message || typeof message.content !== "string") {
        throw new Error("AI response missing content");
    }

    let parsedData: any;
    try {
        parsedData = JSON.parse(message.content);
    } catch (err) {
        console.error("Invalid JSON from AI:", message.content);
        throw new Error("AI returned invalid JSON");
    }

    // Unwrap if AI wrapped response in a top-level key like "resume" or "data"
    let raw = parsedData;
    if (raw.resume && typeof raw.resume === "object") {
        raw = raw.resume;
    } else if (raw.data && typeof raw.data === "object") {
        raw = raw.data;
    }

    // Normalize template
    const validTemplates = ["classic", "minimal", "modern", "minimalImage", "atsFriendly"];
    const template = validTemplates.includes(raw.template) ? raw.template : "classic";

    // Normalize accent color
    const accentColor = typeof raw.accentColor === "string" && /^#([0-9A-Fa-f]{6})$/.test(raw.accentColor)
        ? raw.accentColor
        : "#3B82F6";

    // Normalize skills
    let skills: string[] = [];
    if (Array.isArray(raw.skills)) {
        skills = raw.skills.map((s: any) => (typeof s === "string" ? s : (s?.name || String(s)))).filter(Boolean);
    } else if (typeof raw.skills === "string") {
        skills = (raw.skills as string).split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    // Normalize personalInfo
    const pInfo = raw.personalInfo || {};
    const personalInfo = {
        image: typeof pInfo.image === "string" ? pInfo.image : "",
        fullName: typeof pInfo.fullName === "string" ? pInfo.fullName : (pInfo.name || ""),
        profession: typeof pInfo.profession === "string" ? pInfo.profession : (pInfo.title || ""),
        email: typeof pInfo.email === "string" ? pInfo.email : "",
        phone: typeof pInfo.phone === "string" ? pInfo.phone : "",
        location: typeof pInfo.location === "string" ? pInfo.location : "",
        linkedin: typeof pInfo.linkedin === "string" ? pInfo.linkedin : "",
        website: typeof pInfo.website === "string" ? pInfo.website : "",
    };

    // Normalize workExperience
    const rawExp = Array.isArray(raw.workExperience) ? raw.workExperience : (Array.isArray(raw.experience) ? raw.experience : []);
    const workExperience = rawExp.map((exp: any) => ({
        company: String(exp?.company || ""),
        position: String(exp?.position || exp?.role || ""),
        startDate: String(exp?.startDate || ""),
        endDate: String(exp?.endDate || ""),
        description: String(exp?.description || ""),
        isCurrent: Boolean(exp?.isCurrent),
    }));

    // Normalize education
    const rawEdu = Array.isArray(raw.education) ? raw.education : [];
    const education = rawEdu.map((edu: any) => ({
        institution: String(edu?.institution || edu?.school || ""),
        degree: String(edu?.degree || ""),
        field: String(edu?.field || edu?.fieldOfStudy || ""),
        graduationDate: String(edu?.graduationDate || edu?.year || ""),
        gpa: edu?.gpa ? String(edu.gpa) : "",
    }));

    // Normalize projects
    const rawProj = Array.isArray(raw.projects) ? raw.projects : [];
    const projects = rawProj.map((proj: any) => ({
        id: proj?.id && typeof proj.id === "string" ? proj.id : uuid(),
        name: String(proj?.name || proj?.title || ""),
        description: String(proj?.description || ""),
        type: String(proj?.type || "Full-Stack Project"),
    }));

    const professionalSummary = typeof raw.professionalSummary === "string"
        ? raw.professionalSummary
        : (typeof raw.summary === "string" ? raw.summary : "");

    const newResume = await prisma.resume.create({
        data: {
            userId,
            title,
            public: Boolean(raw.public),
            template,
            accentColor,
            professionalSummary,
            skills,
            personalInfo,
            workExperience,
            education,
            projects,
        },
    });

    return newResume;
};

