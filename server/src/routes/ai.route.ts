import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { enhanceDescription, enhanceProfessionalSummary, enhanceProject, checkAtsScore, generatePortfolio, getPortfolio, editPortfolio } from "../controllers/ai.controller.js";

const aiRouter = express.Router();

aiRouter.post("/enhance-summary", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-description", protect, enhanceDescription);
aiRouter.post("/enhance-project", protect, enhanceProject);
aiRouter.post("/ats-score", protect, checkAtsScore);
aiRouter.post("/generate-portfolio", protect, generatePortfolio);
aiRouter.get("/portfolio/:id", getPortfolio);
aiRouter.put("/portfolio/edit", protect, editPortfolio);

export default aiRouter;