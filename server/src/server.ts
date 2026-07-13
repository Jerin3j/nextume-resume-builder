import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import prisma from "./prismaClient.js";
import userRouter from "./routes/user.route.js";
import resumeRouter from "./routes/resume.route.js";
import aiRouter from "./routes/ai.route.js";
import paymentRouter from "./routes/payment.route.js";
const PORT: string | number = process.env.PORT || 3001;
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);
app.use("/api/payment", paymentRouter);
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});