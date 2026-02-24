"use client";
import { logout } from "@/lib/redux/authSlice";
import { RootState } from "@/lib/redux/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.authReducer);
  const router = useRouter();
  const dispatch = useDispatch();
  const logoutUser = () => {
    router.push("/");
    dispatch(logout());
  };
  return (
    <div className="shadow bg-white">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all">
        <Link href="/">
          <svg
            width="157"
            height="40"
            viewBox="0 0 157 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="0"
              y="28"
              fontFamily="Arial, sans-serif"
              fontSize="28"
              fill="#020618"
              fontWeight="600"
            >
              nextume<tspan fill="#4F39F6">.</tspan>
            </text>
          </svg>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <p className="max-sm:hidden relative inline-block">
            Hi, {user?.name}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 10"
              className="absolute left-0 -bottom-1 w-full"
            >
              <path
                d="M0 5 Q50 10, 100 5 T200 5"
                stroke="#9400D3"
                strokeWidth="7"
                fill="transparent"
              />
            </svg>
          </p>

          <button
            onClick={logoutUser}
            className="bg-white hover:bg-slate-50 border-gray-300 text-red-600 px-7 py-1.5 rounded-full active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
