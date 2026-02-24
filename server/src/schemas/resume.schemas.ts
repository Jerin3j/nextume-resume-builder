import * as z from "zod";

export const personalInfoSchema = z.object({
    image: z.string().default(""),
    fullName: z.string().default(""),
    profession: z.string().default(""),
    email: z.string().default(""),
    phone: z.string().default(""),
    location: z.string().default(""),
    linkedin: z.string().default(""),
    website: z.string().default(""),
})

export const experienceSchema = z.array(z.object({
    company: z.string(),
    position: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string(),
    isCurrent: z.boolean().default(false)
}))

export const projectSchema = z.array(z.object({
    name: z.string(),
    description: z.string(),
    type: z.string()
}))

export const educationSchema = z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    graduationDate: z.string(),
    gpa: z.string().nullable().optional(),
}))

export const resumeSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  public: z.boolean().optional(),
  template: z.enum(["classic", "minimal", "modern", "minimalImage", "atsFriendly"]).optional(),
  accentColor: z.string().regex(/^#([0-9A-Fa-f]{6})$/).optional(),
  professionalSummary: z.string().max(2000).nullable().optional(),
  skills: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),

  personalInfo: personalInfoSchema.optional(),
  workExperience: experienceSchema.optional(),
  education: educationSchema.optional(),
  projects: projectSchema.optional(),
});
