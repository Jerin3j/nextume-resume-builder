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

        // const companyNameVal = companyName?.trim() || "Hiring Company";
        // const jobTitleVal = jobTitle?.trim() || "Job Position";

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
            // 1. Max 2 total generated cover letters (exclude Uploaded)
            const generatedCount = user.coverLetters.filter(cl => cl.tone !== "Uploaded").length;
            if (generatedCount >= 2) {
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

        const hasSpecificJob = Boolean(companyName?.trim() || jobTitle?.trim());
        const companyNameVal = companyName?.trim() || "a leading company";
        const jobTitleVal = jobTitle?.trim() || "the targeted role";

        //         const systemPrompt = `You are a world-class professional cover letter writer and career coach.
        // Your task is to write a highly tailored, persuasive, and ATS-friendly cover letter for a candidate.

        // Inputs:
        // - Company Name: ${companyName?.trim() ? companyName.trim() : ""}
        // - Job Title: ${jobTitle?.trim() ? jobTitle.trim() : ""}
        // - Hiring Manager: ${hiringManager?.trim() ? hiringManager.trim() : "Hiring Manager"}
        // - Candidate Resume details:
        // ${finalResumeText}
        // ${(user.isPro && jobDescription) ? `- Target Job Description:\n${jobDescription}` : ""}

        // Style Constraints:
        // - Tone: ${tonePrompt}
        // - Length: ${lengthPrompt}

        // Important Instructions:
        // 1. Generate ONLY the cover letter content. Do not include any headers, greeting placeholders like '[Date]', '[Address]', or footers/explanations. Start directly with the greeting (e.g. 'Dear ${hiringManager?.trim() ? hiringManager.trim() : "Hiring Manager"},') and end with the professional sign-off (e.g. 'Sincerely, [Name]' or the candidate name). Include the greeting exactly ONCE at the beginning and do NOT repeat or duplicate it.
        // 2. ${hasSpecificJob ? `Highlight specific skills and experiences from the resume that directly align with the job title ${jobTitleVal} and company ${companyNameVal}.` : `Write a versatile, high-impact cover letter highlighting the candidate's strongest skills, achievements, and experiences from the resume that demonstrate strong qualification for professional roles.`}
        // 3. Maintain an ATS-friendly, professional document structure.
        // 4. Ensure the output is returned as plain text. Do not wrap the response in markdown blocks or json.`;

        // const userMessage = hasSpecificJob
        //     ? `Please generate the cover letter for the role of ${jobTitleVal} at ${companyNameVal}.`
        //     : `Please generate a versatile professional cover letter based on my resume qualifications.`;

        const systemPrompt = `You are a world-class professional cover letter writer and career coach.

Your task is to write a highly tailored, persuasive, ATS-friendly cover letter based on the candidate's resume.

Candidate Resume:
${finalResumeText}

${hasSpecificJob ? `
TARGETED APPLICATION

The candidate has provided specific job information.

Company Name: ${companyNameVal || "Not provided"}
Job Title: ${jobTitleVal || "Not provided"}
Hiring Manager: ${hiringManager?.trim() || "Hiring Manager"}

${(user.isPro && jobDescription?.trim())
                    ? `Target Job Description:
${jobDescription.trim()}`
                    : ""}

Write the cover letter specifically for this opportunity.
Use only the provided company, job title, and job description.
Do not invent missing company or job information.
` : `
GENERAL APPLICATION

The candidate has NOT provided a specific company, job title, or job description.

This is a general application based ONLY on the candidate's resume.

CRITICAL RULES FOR GENERAL APPLICATION:
- Do NOT mention any specific company.
- Do NOT mention any specific job title.
- Do NOT invent or assume a position or role.
- Do NOT write phrases such as "the Full Stack Developer position", "the Software Engineer role", or similar.
- Do NOT mention "your company" or "your organization" as though applying to a specific employer.
- Focus entirely on the candidate's skills, experience, accomplishments, strengths, and overall professional value.
- Keep the letter versatile so it can be used when applying to different opportunities.
`}

Style Constraints:
- Tone: ${tonePrompt}
- Length: ${lengthPrompt}

Important Instructions:
1. Generate ONLY the cover letter content.
2. Do not include a date, address, subject line, "To:", headers, placeholders, explanations, or markdown.
3. ${hasSpecificJob
                ? `Start exactly with "Dear ${hiringManager?.trim() || "Hiring Manager"},"`
                : `Start exactly with "Dear Hiring Manager,"`
            }
4. Include the greeting exactly once.
5. End with a professional sign-off.
6. Do not invent facts, employers, positions, achievements, technologies, or experience that are not supported by the resume.
7. Return plain text only.`;

        const userMessage = hasSpecificJob
            ? `Generate a tailored cover letter for ${jobTitleVal || "the provided opportunity"}${companyNameVal ? ` at ${companyNameVal}` : ""}.`
            : `Generate a general professional cover letter based exclusively on my resume. Do not target any specific job, company, or position.`;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL!,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
        });

        const rawContent = response.choices[0]?.message?.content;
        if (!rawContent) {
            throw new Error("AI returned empty content");
        }

        // Sanitize content to ensure no duplicate greetings at start
        let content = rawContent.trim();
        const greetingRegex = /^(Dear\s+[^,\n]+[,:]?\s*[\r\n]+)\s*(Dear\s+[^,\n]+[,:]?\s*[\r\n]+)+/i;
        if (greetingRegex.test(content)) {
            content = content.replace(greetingRegex, "$1\n");
        }
        const contentLines = content.split(/\r?\n/);
        const firstGreetingIdx = contentLines.findIndex(l => /^Dear\s+/i.test(l.trim()));
        if (firstGreetingIdx !== -1) {
            const secondGreetingIdx = contentLines.findIndex((l, idx) => idx > firstGreetingIdx && /^Dear\s+/i.test(l.trim()) && idx - firstGreetingIdx <= 4);
            if (secondGreetingIdx !== -1) {
                contentLines.splice(secondGreetingIdx, 1);
                content = contentLines.join("\n");
            }
        }

        // Save cover letter to database
        const coverLetter = await prisma.coverLetter.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                resume: finalResumeId
                    ? {
                        connect: {
                            id: finalResumeId,
                        },
                    }
                    : undefined,
                companyName: companyName?.trim() || null,
                jobTitle: jobTitle?.trim() || null,
                hiringManager: hiringManager?.trim() || null,
                jobDescription:
                    user.isPro && jobDescription?.trim()
                        ? jobDescription.trim()
                        : null,
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
            const generatedCount = user.coverLetters.filter(cl => cl.tone !== "Uploaded").length;
            if (generatedCount >= 2) {
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

// POST: /api/cover-letters/upload
export const uploadExternalCoverLetter = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { companyName, jobTitle, hiringManager, content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const companyNameVal = companyName?.trim() || "Hiring Company";
        const jobTitleVal = jobTitle?.trim() || "Job Position";

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Save cover letter to database as "Uploaded" (skips limit validations)
        const coverLetter = await prisma.coverLetter.create({
            data: {
                userId,
                resumeId: null,
                companyName: companyNameVal,
                jobTitle: jobTitleVal,
                hiringManager: hiringManager || null,
                jobDescription: null,
                tone: "Uploaded",
                length: "Uploaded",
                content,
            },
        });

        res.status(201).json({
            success: true,
            coverLetter,
        });
    } catch (error: any) {
        console.error("Upload Cover Letter Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error. Failed to save uploaded cover letter.",
        });
    }
};

// POST: /api/cover-letters/parse
export const parseUploadedCoverLetter = async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const systemPrompt = `You are an expert AI assistant parsing cover letter text.
Extract the following details from the cover letter text:
- Company Name
- Job Title
- Hiring Manager Name (if found, otherwise null)

Provide the response in the following JSON format:
{
  "companyName": "string or null",
  "jobTitle": "string or null",
  "hiringManager": "string or null"
}
Do not include any extra text.`;

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL!,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Here is the cover letter text:\n\n${content}` },
            ],
            response_format: { type: "json_object" },
        });

        const message = response.choices[0]?.message?.content;
        if (!message) {
            throw new Error("AI returned empty content");
        }

        const parsed = JSON.parse(message);
        res.status(200).json({
            success: true,
            companyName: parsed.companyName || "",
            jobTitle: parsed.jobTitle || "",
            hiringManager: parsed.hiringManager || "",
        });
    } catch (error: any) {
        console.error("Parse Cover Letter Error:", error);
        res.status(500).json({ success: false, message: "Failed to parse cover letter details" });
    }
};
