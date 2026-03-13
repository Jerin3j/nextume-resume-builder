"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "@/app/utils/axiosInstance";
import { setUser } from "@/lib/redux/authSlice";
import { Lock, Mail, User2Icon } from "lucide-react";

type AuthMode = "login" | "signup";

const LoginClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const mode: AuthMode = useMemo(() => {
    const param = searchParams.get("mode");
    return param === "signup" ? "signup" : "login";
  }, [searchParams]);
  const isSignup = mode === "signup";
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload =
        mode === "signup"
          ? formData
          : { email: formData.email, password: formData.password };

      const res = await axiosInstance.post(`/users/${mode}`, payload);

      dispatch(setUser(res.data.user));
      localStorage.setItem("token", res.data.token);

      toast.success(res.data.message || "Success");
      router.push("/dashboard");
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
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={16} color="#6B7280" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border-none outline-none ring-0"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={13} color="#6B7280" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none outline-none ring-0"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={13} color="#6B7280" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {mode === "login" && (
          <div className="mt-4 text-left text-violet-500">
            <button className="text-sm" type="reset">
              Forget password?
            </button>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full h-11 rounded-full text-white bg-violet-500 disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
        </button>
        <p
          onClick={() =>
            router.push(`/login?mode=${isSignup ? "login" : "signup"}`)
          }
          className="text-gray-500 text-sm mt-3 mb-11"
        >
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <a href="#" className="text-violet-500 hover:underline">
            click here
          </a>
        </p>
        {/* <button
          type="button"
          className=" w-full flex items-center gap-2 justify-center mb-5 bg-white/90 shadow py-2.5 rounded-full text-black"
        >
          <img
            className="h-4 w-4"
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png"
            alt="appleLogo"
          />
          Log in with Google
        </button> */}
      </form>
    </div>
  );
};

export default LoginClient;
