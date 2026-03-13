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
      messages: [
        {
          role: "system",
          content: `
You are an expert resume writer.

Create a professional summary in strictly 1-2 sentences (max 50 words). 
Highlight achievements, technical skills, and career goals in a fresh, compelling way. 
Do NOT just rephrase the user's text. Make it ATS-friendly. 
Return plain text only, no formatting or explanations.
`,
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
      messages: [
        {
          role: "system",
          content: `
You are an expert resume writer.

Your task is to improve and strengthen the user's job description.

Instructions:
- If the input is long or unstructured, condense and rewrite it into exactly 2 strong, concise sentences.
- If the input already contains 1–2 sentences, enhance them with stronger action verbs and clearer impact.
- Do NOT repeat the user's wording.
- Add measurable results or impact where possible.
- Keep it concise and professional.
- Return only plain text with 2 sentences.
- Do NOT add bullets, symbols, or explanations.
`,
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

// controller for enhancing full project object
// POST: /api/ai/enhance-project
export const enhanceProject = async (req: Request, res: Response) => {
  try {
    const { description, name, type } = req.body;

    if (!description || !name || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL!,
      messages: [
        {
          role: "system",
          content: `
You are an expert resume and portfolio writer.

Your task is to enhance a full-stack project entry.

Instructions:
1. Rewrite and strengthen the DESCRIPTION first:
   - Convert into exactly 2 powerful, concise sentences.
   - Use strong action verbs.
   - Add measurable impact where possible.
   - Make it ATS-friendly.
   - Do NOT repeat wording.
   - No bullets or symbols.

2. Improve the PROJECT NAME:
   - Make it more impactful and professional.
   - Keep it concise.

3. Keep the TYPE professional and clean (e.g., Full-Stack Project).

Return strictly in this JSON format:

{
  "description": "Enhanced description here",
  "name": "Improved project name here",
  "type": "Project type here"
}

Return only valid JSON. No explanations. No extra text.
`,
        },
        {
          role: "user",
          content: `
Description: ${description}
Name: ${name}
Type: ${type}
`,
        },
      ],
    });

    const enhancedContent = response.choices[0]?.message?.content;

    res.status(200).json({
      enhancedContent: JSON.parse(enhancedContent || "{}"),
    });
  } catch (error) {
    console.error("Enhance Project Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
