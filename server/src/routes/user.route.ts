import express from "express";
import {
  getUserById,
  getUserResumes,
  loginUser,
  registerUser,
  forgetPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/me", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);

export default userRouter;
