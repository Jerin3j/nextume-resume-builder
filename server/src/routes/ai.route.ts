import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { enhanceDescription, enhanceProfessionalSummary, enhanceProject } from "../controllers/ai.controller.js";

const aiRouter = express.Router();

aiRouter.post("/enhance-summary", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-description", protect, enhanceDescription);
aiRouter.post("/enhance-project", protect, enhanceProject);

export default aiRouter;