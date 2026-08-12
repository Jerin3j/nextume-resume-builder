import { Request, Response } from "express";
import ai from "../configs/ai.js";
import prisma from "../prismaClient.js";
import { parseAndSaveResume } from "../utils/resumeParser.js";
import { formatResumeToText } from "../utils/resumeFormatter.js";

// POST: /api/cover-letters/generate
export const generateCoverLetter = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const {
            resumeId,
            resumeText,
            companyName,
            jobTitle,
            hiringManager,
            jobDescription,
            tone = "Professional",
            length = "Medium",
        } = req.body;

        if (!companyName || !jobTitle) {
            return res.status(400).json({ message: "Company Name and Job Title are required" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { coverLetters: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Limit Checks
        if (!user.isPro) {
            // Free Tier limits
            // 1. Max 2 total cover letters
            if (user.coverLetters.length >= 2) {
                return res.status(403).json({
                    success: false,
                    message: "You have reached the maximum limit of 2 cover letters on the Free plan. Upgrade to Pro to unlock unlimited cover letters."
                });
            }

            // 2. Only one cover letter per resume
            if (resumeId) {
                const existingCoverLetter = user.coverLetters.find(cl => cl.resumeId === Number(resumeId));
                if (existingCoverLetter) {
                    return res.status(403).json({
                        success: false,
                        message: "Only one cover letter may be generated per resume on the Free plan. Upgrade to Pro to create multiple versions."
                    });
                }
            }

            // 3. Force professional tone and medium length for free users
            if (tone !== "Professional" || length !== "Medium") {
                return res.status(403).json({
                    success: false,
                    message: "Custom tones and lengths are Pro features. Upgrade to Pro to unlock them."
                });
            }
        } else {
            // Pro Tier limits: Up to 3 cover letter generations per resume
            if (resumeId) {
                const coverLetterCount = user.coverLetters.filter(cl => cl.resumeId === Number(resumeId)).length;
                if (coverLetterCount >= 3) {
                    return res.status(403).json({
                        success: false,
                        message: "You have reached the limit of 3 cover letters for this resume on the Pro plan."
                    });
                }
            }
        }

        // Extract/Get Resume text
        let finalResumeText = "";
        let finalResumeId = resumeId ? Number(resumeId) : null;
        if (resumeId) {
            const resume = await prisma.resume.findFirst({
                where: { id: Number(resumeId), userId },
            });
            if (!resume) {
                return res.status(404).json({ message: "Selected resume not found or does not belong to you." });
            }
            finalResumeText = formatResumeToText(resume);
        } else if (resumeText) {
            // Only use AI to parse when user uploads on these scenarios
            const newResume = await parseAndSaveResume(userId, "Uploaded Resume", resumeText);
            finalResumeId = newResume.id;
            finalResumeText = formatResumeToText(newResume);
        } else {
            return res.status(400).json({ message: "Please select a resume or provide resume text to generate a cover letter." });
        }

        // Prompts config
        let tonePrompt = "";
        switch (tone) {
            case "Friendly":
                tonePrompt = "Write in a warm, approachable, personal, and conversational tone.";
                break;
            case "Confident":
                tonePrompt = "Write in a strong, direct, self-assured tone that clearly highlights accomplishments and value.";
                break;
            case "Enthusiastic":
                tonePrompt = "Write in an energetic, highly passionate, and excited tone showing deep interest in the role and company.";
                break;
            case "Formal":
                tonePrompt = "Write in a traditional, respectful, highly professional, and conventional business tone.";
                break;
            case "Startup Style":
                tonePrompt = "Write in a modern, conversational, innovative, slightly casual, and startup-friendly tone.";
                break;
            default:
                tonePrompt = "Write in a polished, professional, and standard business-like tone.";
        }

        let lengthPrompt = "";
        switch (length) {
            case "Short":
                lengthPrompt = "Make the cover letter concise and quick to read. Limit to 150-200 words and around 3 paragraphs.";
                break;
            case "Detailed":
                lengthPrompt = "Make the cover letter comprehensive and detailed. Around 400-500 words and 5 paragraphs, deep diving into accomplishments.";
                break;
            default:
                lengthPrompt = "Make the cover letter standard length. Around 250-300 words and 4 paragraphs.";
        }

        const systemPrompt = `You are a world-class professional cover letter writer and career coach.
Your task is to write a highly tailored, persuasive, and ATS-friendly cover letter for a candidate.

Inputs:
- Company Name: ${companyName}
- Job Title: ${jobTitle}
- Hiring Manager: ${hiringManager || "Hiring Manager"}
- Candidate Resume details:
${finalResumeText}
${(user.isPro && jobDescription) ? `- Target Job Description:\n${jobDescription}` : ""}

Style Constraints:
- Tone: ${tonePrompt}
- Length: ${lengthPrompt}

Important Instructions:
1. Generate ONLY the cover letter content. Do not include any headers, greeting placeholders like '[Date]', '[Address]', or footers/explanations. Start directly with the greeting (e.g. 'Dear Hiring Manager,' or 'Dear ${hiringManager},') and end with the professional sign-off (e.g. 'Sincerely, [Name]' or the candidate name).
2. Highlight specific skills and experiences from the resume that directly align with the job title ${jobTitle} and company ${companyName}.
3. Maintain an ATS-friendly, professional document structure.
4. Ensure the output is returned as plain text. Do not wrap the response in markdown blocks or json.`;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL!,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Please generate the cover letter for the role of ${jobTitle} at ${companyName}.` },
            ],
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("AI returned empty content");
        }

        // Save cover letter to database
        const coverLetter = await prisma.coverLetter.create({
            data: {
                userId,
                resumeId: finalResumeId,
                companyName,
                jobTitle,
                hiringManager: hiringManager || null,
                jobDescription: (user.isPro && jobDescription) ? jobDescription : null,
                tone,
                length,
                content,
            },
        });

        res.status(201).json({
            success: true,
            coverLetter,
        });

    } catch (error: any) {
        console.error("Generate Cover Letter Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error. Failed to generate cover letter.",
        });
    }
};

// GET: /api/cover-letters
export const getCoverLetters = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const coverLetters = await prisma.coverLetter.findMany({
            where: { userId },
            include: {
                resume: {
                    select: {
                        title: true,
                        template: true,
                        updatedAt: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, coverLetters });
    } catch (error: any) {
        console.error("Get Cover Letters Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// GET: /api/cover-letters/:id
export const getCoverLetterById = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const id = Number(req.params.id);
        const coverLetter = await prisma.coverLetter.findFirst({
            where: { id, userId },
            include: { resume: true }
        });
        if (!coverLetter) {
            return res.status(404).json({ message: "Cover letter not found" });
        }
        res.status(200).json({ success: true, coverLetter });
    } catch (error: any) {
        console.error("Get Cover Letter By ID Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// PUT: /api/cover-letters/:id
export const updateCoverLetter = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const id = Number(req.params.id);
        const { companyName, jobTitle, hiringManager, content } = req.body;

        const coverLetter = await prisma.coverLetter.findFirst({
            where: { id, userId },
        });

        if (!coverLetter) {
            return res.status(404).json({ message: "Cover letter not found" });
        }

        const updated = await prisma.coverLetter.update({
            where: { id },
            data: {
                companyName: companyName !== undefined ? companyName : coverLetter.companyName,
                jobTitle: jobTitle !== undefined ? jobTitle : coverLetter.jobTitle,
                hiringManager: hiringManager !== undefined ? hiringManager : coverLetter.hiringManager,
                content: content !== undefined ? content : coverLetter.content,
            },
        });

        res.status(200).json({ success: true, coverLetter: updated, message: "Cover letter updated successfully!" });
    } catch (error: any) {
        console.error("Update Cover Letter Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// POST: /api/cover-letters/:id/duplicate
export const duplicateCoverLetter = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const id = Number(req.params.id);

        const coverLetter = await prisma.coverLetter.findFirst({
            where: { id, userId },
        });

        if (!coverLetter) {
            return res.status(404).json({ message: "Cover letter not found" });
        }

        // Check limits before duplicating (duplicating is a creation of cover letter)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { coverLetters: true },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isPro) {
            if (user.coverLetters.length >= 2) {
                return res.status(403).json({
                    success: false,
                    message: "You have reached the maximum limit of 2 cover letters on the Free plan. Upgrade to Pro to clone or create new cover letters."
                });
            }
            if (coverLetter.resumeId) {
                const existingCoverLetter = user.coverLetters.find(cl => cl.resumeId === coverLetter.resumeId);
                if (existingCoverLetter) {
                    return res.status(403).json({
                        success: false,
                        message: "Only one cover letter may be generated per resume on the Free plan. Upgrade to Pro to create multiple versions."
                    });
                }
            }
        } else {
            if (coverLetter.resumeId) {
                const coverLetterCount = user.coverLetters.filter(cl => cl.resumeId === coverLetter.resumeId).length;
                if (coverLetterCount >= 3) {
                    return res.status(403).json({
                        success: false,
                        message: "You have reached the limit of 3 cover letters for this resume on the Pro plan."
                    });
                }
            }
        }

        const duplicated = await prisma.coverLetter.create({
            data: {
                userId,
                resumeId: coverLetter.resumeId,
                companyName: `${coverLetter.companyName} (Copy)`,
                jobTitle: coverLetter.jobTitle,
                hiringManager: coverLetter.hiringManager,
                jobDescription: coverLetter.jobDescription,
                tone: coverLetter.tone,
                length: coverLetter.length,
                content: coverLetter.content,
            },
        });

        res.status(201).json({ success: true, coverLetter: duplicated, message: "Cover letter duplicated successfully!" });
    } catch (error: any) {
        console.error("Duplicate Cover Letter Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// DELETE: /api/cover-letters/:id
export const deleteCoverLetter = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const id = Number(req.params.id);

        const coverLetter = await prisma.coverLetter.findFirst({
            where: { id, userId },
        });

        if (!coverLetter) {
            return res.status(404).json({ message: "Cover letter not found" });
        }

        await prisma.coverLetter.delete({
            where: { id },
        });

        res.status(200).json({ success: true, message: "Cover letter deleted successfully!" });
    } catch (error: any) {
        console.error("Delete Cover Letter Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
