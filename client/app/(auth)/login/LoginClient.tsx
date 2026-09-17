"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "@/app/utils/axiosInstance";
import { setUser } from "@/lib/redux/authSlice";
import { Lock, Mail, User2Icon, KeyRound, X, LoaderCircle, Eye, EyeOff } from "lucide-react";

type AuthMode = "login" | "register";

const LoginClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const mode: AuthMode = useMemo(() => {
    const param = searchParams.get("mode");
    return param === "register" ? "register" : "login";
  }, [searchParams]);
  const isSignup = mode === "register";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleOpenForgotModal = () => {
    setForgotEmail(formData.email || "");
    setForgotStep(1);
    setOtpCode("");
    setNewPassword("");
    setConfirmPassword("");
    setShowForgotModal(true);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email address");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await axiosInstance.post("/users/forget-password", {
        email: forgotEmail,
      });
      if (res.data.success) {
        toast.success(res.data.message || "OTP sent to email");
        setForgotStep(2);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await axiosInstance.post("/users/reset-password", {
        email: forgotEmail,
        code: otpCode,
        newPassword,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Password reset successful!");
        setShowForgotModal(false);
        setForgotStep(1);
        setOtpCode("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload =
        mode === "register"
          ? formData
          : { email: formData.email, password: formData.password };

      const res = await axiosInstance.post(`/users/${mode}`, payload);

      dispatch(setUser(res.data.user));
      localStorage.setItem("token", res.data.token);

      toast.success(res.data.message || "Success");
      const redirectPath = searchParams.get("redirect") || "/dashboard";
      router.push(redirectPath);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="md:w-[350px] text-center md:border md:border-gray-300/60 rounded-2xl px-8 md:bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {mode === "login" ? "Login" : "Sign up"}
        </h1>
        <p className="text-gray-500 text-sm mt-2">Please {mode} to continue</p>
        {mode !== "login" && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2">
            <User2Icon size={16} color="#6B7280" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border-none outline-none ring-0 text-sm w-full pl-2"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2">
          <Mail size={13} color="#6B7280" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none outline-none ring-0 text-sm w-full pl-2"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2">
          <Lock size={13} color="#6B7280" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0 text-sm w-full pl-2"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {mode === "login" && (
          <div className="mt-4 text-left text-violet-500">
            <button
              type="button"
              onClick={handleOpenForgotModal}
              className="text-sm font-medium hover:underline cursor-pointer"
            >
              Forget password?
            </button>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full h-11 rounded-full text-white bg-violet-500 hover:bg-violet-600 disabled:opacity-50 cursor-pointer font-medium text-sm transition-colors"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
        </button>
        <p
          onClick={() =>
            router.push(`/login?mode=${isSignup ? "login" : "register"}`)
          }
          className="text-gray-500 text-sm mt-3 mb-11 cursor-pointer"
        >
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span className="text-violet-500 hover:underline">
            click here
          </span>
        </p>
      </form>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          onClick={() => setShowForgotModal(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-sm p-6 space-y-5"
          >
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            {forgotStep === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-800">
                    Forgot Password
                  </h2>
                  <p className="text-xs text-slate-400">
                    Enter your registered email address to receive an OTP.
                  </p>
                </div>

                <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-11 rounded-xl overflow-hidden px-3.5 gap-2.5 focus-within:border-violet-500 focus-within:bg-white transition-all">
                  <Mail size={16} className="text-slate-400 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full text-sm bg-transparent outline-none ring-0 text-slate-800 border-none pl-2"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    disabled={forgotLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-violet-100 disabled:opacity-50"
                >
                  {forgotLoading && (
                    <LoaderCircle className="animate-spin w-4 h-4 text-white" />
                  )}
                  {forgotLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-800">
                    Reset Password
                  </h2>
                  <p className="text-xs text-slate-400">
                    Enter the OTP sent to <span className="font-semibold text-slate-700">{forgotEmail}</span> and set your new password.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-11 rounded-xl overflow-hidden px-3.5 gap-2.5 focus-within:border-violet-500 focus-within:bg-white transition-all">
                    <KeyRound size={16} className="text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="6-digit OTP code"
                      className="w-full text-sm bg-transparent outline-none ring-0 text-slate-800 border-none pl-2"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                      disabled={forgotLoading}
                    />
                  </div>

                  <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-11 rounded-xl overflow-hidden px-3.5 gap-2.5 focus-within:border-violet-500 focus-within:bg-white transition-all">
                    <Lock size={16} className="text-slate-400 flex-shrink-0" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New password"
                      className="w-full text-sm bg-transparent outline-none ring-0 text-slate-800 border-none pl-2"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={forgotLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-11 rounded-xl overflow-hidden px-3.5 gap-2.5 focus-within:border-violet-500 focus-within:bg-white transition-all">
                    <Lock size={16} className="text-slate-400 flex-shrink-0" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full text-sm bg-transparent outline-none ring-0 text-slate-800 border-none pl-2"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={forgotLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    disabled={forgotLoading}
                    className="text-xs text-violet-600 hover:underline cursor-pointer"
                  >
                    Resend OTP / Change Email
                  </button>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-violet-100 disabled:opacity-50"
                  >
                    {forgotLoading && (
                      <LoaderCircle className="animate-spin w-4 h-4 text-white" />
                    )}
                    {forgotLoading ? "Saving..." : "Save Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginClient;
