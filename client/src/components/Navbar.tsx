import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = { name: "Jerin J" };
  const navigate = useNavigate();

  const logoutUser = () => {
    navigate("/");
  };
  return (
    <div className="shadow bg-white">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all">
        <Link to="/">
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
              font-family="Arial, sans-serif"
              font-size="28"
              fill="#020618"
              font-weight="600"
            >
              nextume<tspan fill="#4F39F6">.</tspan>
            </text>
          </svg>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <p className="max-sm:hidden">Hi, {user?.name}</p>
          <button
            onClick={logoutUser}
            className="bg-white hover:bg-slate-50 border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
