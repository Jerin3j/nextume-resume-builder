export const formatResumeToText = (resume: any) => {
    let text = "";
    if (resume.title) text += `Title: ${resume.title}\n`;
    if (resume.professionalSummary) text += `Professional Summary:\n${resume.professionalSummary}\n\n`;
    if (resume.personalInfo) {
        const pi = resume.personalInfo as any;
        text += `Contact Information:\n`;
        if (pi.fullName) text += `Name: ${pi.fullName}\n`;
        if (pi.profession) text += `Profession: ${pi.profession}\n`;
        if (pi.email) text += `Email: ${pi.email}\n`;
        if (pi.phone) text += `Phone: ${pi.phone}\n`;
        if (pi.location) text += `Location: ${pi.location}\n`;
        if (pi.linkedin) text += `LinkedIn: ${pi.linkedin}\n`;
        if (pi.website) text += `Website: ${pi.website}\n`;
        text += `\n`;
    }
    if (resume.skills && resume.skills.length > 0) {
        text += `Skills:\n${resume.skills.join(", ")}\n\n`;
    }
    if (resume.workExperience && resume.workExperience.length > 0) {
        text += `Work Experience:\n`;
        resume.workExperience.forEach((exp: any) => {
            text += `- Position: ${exp.position} at ${exp.company}\n`;
            text += `  Duration: ${exp.startDate} to ${exp.isCurrent ? "Present" : exp.endDate}\n`;
            text += `  Description: ${exp.description}\n`;
        });
        text += `\n`;
    }
    if (resume.education && resume.education.length > 0) {
        text += `Education:\n`;
        resume.education.forEach((edu: any) => {
            text += `- ${edu.degree} in ${edu.field} at ${edu.institution}\n`;
            text += `  Graduation: ${edu.graduationDate}\n`;
            if (edu.gpa) text += `  GPA: ${edu.gpa}\n`;
        });
        text += `\n`;
    }
    if (resume.projects && resume.projects.length > 0) {
        text += `Projects:\n`;
        resume.projects.forEach((proj: any) => {
            text += `- Project Name: ${proj.name} (${proj.type})\n`;
            text += `  Description: ${proj.description}\n`;
        });
        text += `\n`;
    }
    return text;
};
