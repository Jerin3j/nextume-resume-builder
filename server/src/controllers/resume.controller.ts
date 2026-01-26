import { Request, Response } from "express";
import prisma from "../prismaClient.js";
import imagekit from "../configs/imageKit.js";
import fs from "fs";
import { educationSchema, experienceSchema, personalInfoSchema, projectSchema, resumeSchema } from "../schemas/resume.schemas.js";

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
    const userId = (req as any).userId;
    const { id } = req.body;
    // deleted resume
    await prisma.resume.delete({
      where: {
        id,
        userId,
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
    const { id } = req.body;
    // take resume
    const resume = await prisma.resume.findUnique({
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
    const { id } = req.body;
    const resume = await prisma.resume.findUnique({
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
//GET : /api/resumes/public
export const updateResume = async (req: Request, res: Response) => {
  try {
    // Resume ID
    const userId = (req as any).userId;
    const { id, resumeData, removeBackgroud } = req.body;
    let resumeDataCopy = JSON.parse(resumeData);
    const image = (req as any).file;
    
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: "resume-image-"+ Date.now(),
        folder: "user-resumes",
        transformation: {
          pre: "h-300,w-300,fo-face,z-0.75" + (removeBackgroud ? ',e-bgremove' : '')
        }
      });
    resumeDataCopy.personalInfo ??= {};
    resumeDataCopy.personalInfo.image = response.url;
    }

    // Zod validation for nested schemas
    const validatedSchema = resumeSchema.parse(resumeDataCopy);

    const resume = await prisma.resume.update({
      where: {
        id,
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
    console.error("Delete Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
