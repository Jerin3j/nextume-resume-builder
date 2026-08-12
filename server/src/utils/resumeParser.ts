import prisma from "../prismaClient.js";
import ai from "../configs/ai.js";
import { v4 as uuid } from "uuid";

export const parseAndSaveResume = async (userId: number, title: string, resumeText: string) => {
    const systemPrompt = "You are an expert AI Agent to extract data from resume.";
    const userPrompt = `extract data from this resume: ${resumeText}
    Provide data in the following JSON format with no additional text before or after:
     {
      "public": "boolean (optional)",
      "template": "classic | minimal | modern | minimalImage(optional) | atsFriendly(optional)",
      "accentColor": "#RRGGBB (optional)",
      "professionalSummary": "string (optional)",
      "skills": ["string"],
    
      "personalInfo": {
        "image": "string",
        "fullName": "string",
        "profession": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "linkedin": "string",
        "website": "string"
      },
    
      "workExperience": [
        {
          "company": "string",
          "position": "string",
          "startDate": "string",
          "endDate": "string",
          "description": "string",
          "isCurrent": "boolean"
        }
      ],
    
      "education": [
        {
          "institution": "string",
          "degree": "string",
          "field": "string",
          "graduationDate": "string",
          "gpa": "string"
        }
      ],
    
      "projects": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "type": "string"
        }
      ]
    };
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

    let parsedData;
    try {
        parsedData = JSON.parse(message.content);
    } catch (err) {
        console.error("Invalid JSON from AI:", message.content);
        throw new Error("AI returned invalid JSON");
    }

    // Add UUID to projects
    if (parsedData.projects && Array.isArray(parsedData.projects)) {
        parsedData.projects = parsedData.projects.map((project: any) => ({
            id: uuid(),
            ...project,
        }));
    }

    const newResume = await prisma.resume.create({
        data: {
            userId,
            title,
            ...parsedData,
        },
    });

    return newResume;
};
