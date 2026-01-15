import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import prisma from "./prismaClient.js";

const PORT: string | number = process.env.PORT || 3001;

app.get("/", async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/user", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const user = await prisma.user.create({
      data: { name, email },
    });

    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
