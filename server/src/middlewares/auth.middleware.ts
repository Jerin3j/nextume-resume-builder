import { NextFunction, Request, Response } from "express";
import jwt,{ JwtPayload } from "jsonwebtoken";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  // get token from header
  const token = req.headers.authorization;

  // 1. Check header existence
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }
  
  // extract token
  const extractedToken = token.split(" ")[1];

  // Verify token
  try {
    const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET as string) as JwtPayload;

    (req as any).userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired",
    });
  }
};
