import { Request, Response } from "express";
import ai from "../configs/ai.js";
import prisma from "../prismaClient.js";
import { parseAndSaveResume } from "../utils/resumeParser.js";
import { formatResumeToText } from "../utils/resumeFormatter.js";
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
// controller for checking resume's ATS score compatibility
// POST: /api/ai/ats-score
export const checkAtsScore = async (req: Request, res: Response) => {
    try {
        const { resumeId, resumeText, jobDescription } = req.body;
        const userId = (req as any).userId;

        let finalResumeText = "";

        if (resumeId) {
            const resume = await prisma.resume.findFirst({
                where: { id: Number(resumeId), userId },
            });
            if (!resume) {
                return res.status(404).json({ message: "Selected resume not found" });
            }
            finalResumeText = formatResumeToText(resume);
        } else if (resumeText) {
            // Only use AI to parse when user uploads on these scenarios
            const newResume = await parseAndSaveResume(userId, "Uploaded Resume", resumeText);
            finalResumeText = formatResumeToText(newResume);
        } else {
            return res.status(400).json({ message: "Missing resume details to analyze" });
        }

        const systemPrompt = `You are an expert ATS (Applicant Tracking System) reviewer and hiring manager. 
Analyze the provided resume text and optionally compare it to the provided job description.
Assess compatibility, structure, formatting patterns, content quality, and keyword inclusion.
Provide your response strictly in the following JSON format:
{
  "score": 75,
  "summary": "Detailed overall assessment summary of the resume's ATS performance...",
  "breakdown": {
   "formatting": {
      "score": 85,
      "feedback": "Feedback on font, columns, structure formatting readability..."
    },
    "structure": {
      "score": 80,
      "feedback": "Feedback on standard section headers, contact info presence, etc..."
    },
    "contentQuality": {
      "score": 70,
      "feedback": "Feedback on language, action verbs, measurable results, etc..."
    },
    "keywordMatch": {
      "score": 65,
      "feedback": "Feedback on target/industry keyword matching..."
    }
  },
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "improvements": [
    {
      "section": "Experience",
      "severity": "high",
      "issue": "Specific issue details...",
      "suggestion": "Specific, actionable fix instruction..."
    }
  ],
  "atsFriendlyAdvice": "Overall tip to make it 100% compliant with older parser systems..."
}
Return ONLY a valid JSON object. No markdown syntax wrapper, no trailing/leading characters, and no explanations outside the JSON structure.`;
        const userPrompt = `
RESUME TEXT:
${finalResumeText}
${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}` : "No specific job description provided. Perform a general industry-standard ATS analysis based on the resume content."}
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
        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("AI returned empty content");
        }
        const analysisResult = JSON.parse(content);
        return res.status(200).json({ analysisResult });
    } catch (error: any) {
        console.error("Check ATS Score Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};// controller for generating AI portfolio website content
// POST: /api/ai/generate-portfolio
export const generatePortfolio = async (
    req: Request,
    res: Response
) => {
    try {
        const { resumeId, resumeData, resumeText, username } = req.body;
        const userId = (req as any).userId;

        let finalResumeData = resumeData;

        if (resumeId) {
            const resume = await prisma.resume.findFirst({
                where: { id: Number(resumeId), userId },
            });
            if (!resume) {
                return res.status(404).json({ message: "Resume not found" });
            }
            finalResumeData = resume;
        } else if (resumeText) {
            // Only use AI to parse when user uploads on these scenarios
            const newResume = await parseAndSaveResume(userId, "Uploaded Resume", resumeText);
            finalResumeData = newResume;
        }

        if (!finalResumeData) {
            return res.status(400).json({
                message: "Resume data missing"
            });
        }
        if (!username) {
            return res.status(400).json({
                message: "Username is missing"
            });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { portfolio: true },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (!user.isPro) {
            if (user.portfolio) {
                return res.status(403).json({
                    success: false,
                    message: "Free users can only generate their portfolio website once. Upgrade to Pro to regenerate and edit the codebase."
                });
            }
        } else {
            if (user.portfolio && user.portfolio.regenCount >= 3) {
                return res.status(403).json({
                    success: false,
                    message: "You have reached the maximum limit of 3 portfolio regenerations on the Pro plan."
                });
            }
        }
        const response =
            await ai.chat.completions.create({
                model: process.env.OPENAI_MODEL!,
                messages: [
                    {
                        role: "system",
                        content: `
You are an expert frontend developer.
Generate a complete responsive portfolio website from resume data.
Requirements:
- Return ONLY HTML code.
- Include internal CSS inside <style>.
- Include no markdown.
- No explanations.
- Single HTML file.
- Modern developer portfolio design.
- Mobile responsive.
- Use semantic HTML.
- Add sections:
1. Hero
2. About
3. Skills
4. Experience
5. Projects
6. Contact
Design:
- Modern SaaS style
- Smooth animations
- Beautiful typography
- Professional colors
- Recruiter friendly
- Clean and premium UI.
- Footer should include branding text like:
"Built with Nextume.app"
- Add copyright text.
- Make footer match the overall portfolio design.
The output will be directly saved as an HTML file and hosted publicly.
`
                    },
                    {
                        role: "user",
                        content:
                            JSON.stringify(finalResumeData)
                    }
                ]
            });
        const html =
            response.choices[0]
                ?.message
                ?.content;
        if (!html) {
            throw new Error(
                "AI generated empty html"
            );
        }
        const portfolio =
            await prisma.portfolio.upsert({
                where: {
                    userId: userId
                },
                update: {
                    html,
                    regenCount: user.portfolio ? { increment: 1 } : 0
                },
                create: {
                    userId: userId,
                    username: username,
                    html,
                    regenCount: 0
                }
            });
        res.status(200).json({
            success: true,
            portfolioId: portfolio.id,
            url: `/portfolio/${portfolio.id}`
        });
    } catch (error: any) {
        console.log(
            "Portfolio generator error",
            error
        );
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
//Controller for getting portfolio based on portfolioId
// GET /api/portfolio/:id
export const getPortfolio = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);
        console.log("req.params.id", req.params.id);
        const portfolio =
            await prisma.portfolio.findUnique({
                where: {
                    id: id,
                }
            });
        if (!portfolio) {
            return res.status(404).json({
                message: "Portfolio not found"
            });
        }
        return res.status(200).json({
            html: portfolio.html
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
}
export const editPortfolio = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { html } = req.body;
        if (!html) {
            return res.status(400).json({ message: "HTML codebase is required" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { portfolio: true },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.isPro) {
            return res.status(403).json({
                success: false,
                message: "Only Pro users can edit their portfolio codebase."
            });
        }
        if (!user.portfolio) {
            return res.status(404).json({
                success: false,
                message: "No portfolio website found to edit. Please generate one first."
            });
        }
        const updatedPortfolio = await prisma.portfolio.update({
            where: { userId },
            data: { html },
        });
        return res.status(200).json({
            success: true,
            message: "Portfolio codebase updated successfully!",
            portfolio: updatedPortfolio,
        });
    } catch (error: any) {
        console.error("Edit Portfolio Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Failed to edit portfolio."
        });
    }
};
