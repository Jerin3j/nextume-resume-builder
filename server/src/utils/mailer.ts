import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendOTP = async (email: string, code: string) => {
  try {
    const data = await resend.emails.send({
      from: 'Nextume <onboarding@resend.dev>',
      to: [email],
      subject: 'Password Reset OTP - Nextume',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Use the OTP code below to reset your password. The code expires in 10 minutes.</p>
          <div style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f3f4f6; text-align: center; border-radius: 8px; letter-spacing: 2px;">
            ${code}
          </div>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend Email Error:", error);
    return { success: false, error };
  }
};
