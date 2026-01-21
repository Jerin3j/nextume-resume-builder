import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import prisma from "./prismaClient.js";
import userRouter from "./routes/user.route.js";

const PORT: string | number = process.env.PORT || 3001;

app.get("/", async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
