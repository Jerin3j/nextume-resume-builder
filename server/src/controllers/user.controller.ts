import { Request, Response } from "express";
import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (userId: number) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  return token;
};

// POST: /api/user/register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // check user existence
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    // new user creation and password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    //token creation
    const token = generateToken(newUser.id);

    //return response
    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Register User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST: /api/user/login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // check user existence
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User with this email does not exist",
      });
    }
    // password hashing
    const comparePassword = await bcrypt.compare(
      password,
      (user as any).password,
    );
    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    //token creation
    const token = generateToken(user.id);

    //remove password from user returning object
    const { password: _, ...userWithoutPassword } = user;

    //return response
    return res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Register User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET: /api/user/me
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //remove password from user returning object
    const { password: _, ...userWithoutPassword } = user;

    //return response
    return res.status(200).json({
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Register User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
