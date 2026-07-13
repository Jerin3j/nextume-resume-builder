import { Request, Response } from "express";
import prisma from "../prismaClient.js";
import razorpay from "../configs/razorpay.js";
import crypto from "crypto";
// Create Razorpay Order
// POST /api/payment/create-order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log("user", user)
    console.log(process.env.RAZORPAY_KEY_ID);
    console.log(process.env.RAZORPAY_KEY_SECRET);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Amount: 99 INR in paise (9900 paise)
    const options = {
      amount: 9900,
      currency: "INR",
      receipt: `receipt_order_${userId}_${Date.now()}`,
      payment_capture: 1,
      notes: {
        userId,
      },
    };
    console.log("options", options);
    const order = await razorpay.orders.create(options);
    console.log("order", order);

    return res.status(201).json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID || "",
    });
  } catch (error: any) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment order",
    });
  }
};
// Verify Payment Signature
// POST /api/payment/verify-payment
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment confirmation parameters",
      });
    }
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(text)
      .digest("hex");
    if (expectedSignature === razorpay_signature) {
      // Payment matches signature! Upgrade user to Pro
      await prisma.user.update({
        where: { id: userId },
        data: { isPro: true },
      });
      return res.status(200).json({
        success: true,
        message: "Upgrade to Pro successful! Welcome to Nextume Pro features.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature verification failed",
      });
    }
  } catch (error: any) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during payment verification",
    });
  }
};
