import { Request, Response } from "express";
import prisma from "../prismaClient.js";
import imagekit from "../configs/imageKit.js";
import fs from "fs";
import {
  resumeSchema,
} from "../schemas/resume.schemas.js";
import ai from "../configs/ai.js";

// POST: /api/resumes/create
export const createResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { title } = req.body;
    // create resume
    const newResume = await prisma.resume.create({
      data: {
        userId,
        title,
      },
    });

    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    console.error("Register User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//DELETE : /api/resumes/delete
export const deleteResume = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.resumeId);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid resume id" });
    }
    // deleted resume
    await prisma.resume.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get resume by ID
//GET : /api/resumes/get
export const getResumeById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.resumeId);
    // take resume
    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    // if anything wrong recheck yt-6:44:40
    return res.status(200).json({ resume });
  } catch (error) {
    console.error("Delete Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get public resume by ID
//GET : /api/resumes/public
export const getPublicResumeById = async (req: Request, res: Response) => {
  try {
    // Resume ID
    const id = Number(req.params.resumeId);
    const resume = await prisma.resume.findFirst({
      where: {
        public: true,
        id,
      },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    return res.status(200).json({ resume });
  } catch (error) {
    console.error("Delete Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get public resume by ID
//GET : /api/resumes/update
export const updateResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    // Resume ID
    const { id, resumeData, removeBackground } = req.body;
    const resumeId = Number(id);
    
    let resumeDataCopy;
    if (typeof resumeData === "string") {
      resumeDataCopy = JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }
    const image = (req as any).file;
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: "resume-image-" + Date.now(),
        folder: "user-resumes",
        transformation: {
          pre:
            `${(removeBackground ? "e-bgremove" : "")},h-300,w-300,fo-face,z-0.75`,
        },
      });
      resumeDataCopy.personalInfo ??= {};
      resumeDataCopy.personalInfo.image = response.url;
    }

    // Zod validation for nested schemas
    const validatedSchema = resumeSchema.parse(resumeDataCopy);

    const resume = await prisma.resume.update({
      where: {
        id: resumeId,
        userId,
      },
      data: {
        ...validatedSchema,
      },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    return res
      .status(200)
      .json({ message: "Updated Successfully", data: resume });
  } catch (error) {
    console.error("Update Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// controller for uploading resume
//POST: /api/resumes/upload-resume
export const uploadResume = async (req: Request, res: Response) => {
  try {
    const { resumeText, title } = req.body;
    const userId = (req as any).userId;

    if (!resumeText || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt =
      "You are an expert AI Agent to extract data from resume.";

    const userPrompt = `extract data from this resume: ${resumeText}
    Provide data in the following JSON format with no additional text before or after:
     {
      "public": "boolean (optional)",
      "template": "classic | minimal | modern | minimalImage(optional)",
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
    console.log(response.choices[0].message);

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

    const newResume = await prisma.resume.create({
      data: {
        userId,
        title,
        ...parsedData,
      },
      // select: { id: true },
    });
    res.status(200).json(newResume);
  } catch (error) {
    console.error("Enhance Description Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};