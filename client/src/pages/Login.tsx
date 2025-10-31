import { Lock, Mail, User2Icon } from "lucide-react";
import { useState } from "react";

const Login = () => {
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  const [state, setState] = useState(urlState || "login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
          {state === "login" ? "Login" : "Sign up"}
        </h1>
        <p className="text-gray-500 text-sm mt-2">Please {state} to continue</p>
        {state !== "login" && (
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
        {state === "login" && (
          <div className="mt-4 text-left text-violet-500">
            <button className="text-sm" type="reset">
              Forget password?
            </button>
          </div>
        )}
        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-full text-white bg-violet-500 hover:opacity-90 transition-opacity"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>
        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-500 text-sm mt-3 mb-11"
        >
          {state === "login"
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

export default Login;
