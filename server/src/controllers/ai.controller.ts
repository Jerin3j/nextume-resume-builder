import { Request, Response } from "express";
import ai from "../configs/ai.js";

// controller for enhanceing resume's professional summary
//POST: /api/ai/enhance-summary
export const enhanceProfessionalSummary = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userContext } = req.body;
    if (!userContext) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL!,
    //   max_tokens: 120,
    //   temperature: 0.5,
      messages: [
        {
          role: "system",
          content:
            "You are am expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ats friendly. And only return text no options or anything else",
        },
        {
          role: "user",
          content: userContext,
        },
      ],
    });
    console.log(response.choices[0].message);
    const enhancedContent = response.choices[0]?.message?.content;
    res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("Enhance Professional Summary Error:", error);
    return res.status(500).json({
      success: false,
     message: "Internal server error",
    });
  }
};

// controller for enhanceing resume's description
//POST: /api/ai/enhance-description
export const enhanceDescription = async (req: Request, res: Response) => {
  try {
    const { userContext } = req.body;
    if (!userContext) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL!,
    //   max_tokens: 120,
    //   temperature: 0.5,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContext,
        },
      ],
    });
    console.log(response.choices[0].message);
    const enhancedContent = response.choices[0]?.message?.content;
    res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("Enhance Description Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
