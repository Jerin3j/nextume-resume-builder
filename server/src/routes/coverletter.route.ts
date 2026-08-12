import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    generateCoverLetter,
    getCoverLetters,
    getCoverLetterById,
    updateCoverLetter,
    duplicateCoverLetter,
    deleteCoverLetter,
} from "../controllers/coverletter.controller.js";

const coverLetterRouter = express.Router();

coverLetterRouter.post("/generate", protect, generateCoverLetter);
coverLetterRouter.get("/", protect, getCoverLetters);
coverLetterRouter.get("/:id", protect, getCoverLetterById);
coverLetterRouter.put("/:id", protect, updateCoverLetter);
coverLetterRouter.post("/:id/duplicate", protect, duplicateCoverLetter);
coverLetterRouter.delete("/:id", protect, deleteCoverLetter);

export default coverLetterRouter;
