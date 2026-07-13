import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="flex flex-col justify-center items-center mt-40 overflow-hidden">
        <div className="flex flex-wrap justify-center lg:justify-between gap-5 md:gap-15 pt-8 md:pt-16 px-6 md:px-16 lg:px-24 xl:px-32 text-[13px] text-gray-500 bg-gradient-to-r from-[#FDFEFF] via-violet-600/20 to-[#FDFEFF]">
          <a href="#" className="self-start">
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
          </a>
          <div className="flex flex-wrap items-start gap-10 md:gap-[60px] xl:gap-[140px]">
            {/* <a href="#" className="hidden md:block">
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
            </a> */}
            <div>
              <p className="text-slate-800 font-semibold">Product</p>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="/" className="hover:text-violet-600 transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-violet-600 transition">
                    Support
                  </a>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-violet-600 transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/ats-score" className="hover:text-violet-600 transition">
                    ATS Checker
                  </Link>
                </li>
                <li>
                  <a href="/" className="hover:text-violet-600 transition">
                    Affiliate
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-slate-800 font-semibold">Resources</p>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="/" className="hover:text-violet-600 transition">
                    Company
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-violet-600 transition">
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-violet-600 transition">
                    Community
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-violet-600 transition">
                    Careers
                    <span className="text-xs text-white bg-violet-600 rounded-md ml-2 px-2 py-1">
                      We’re hiring!
                    </span>
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-violet-600 transition">
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-slate-800 font-semibold">Legal</p>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="/" className="hover:text-violet-600 transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-violet-600 transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col max-md:items-center max-md:text-center gap-2 items-end">
            <p className="wo-full md:max-w-60">
              Helping professionals create resumes, optimize for ATS, and showcase their work with confidence.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <a
                href="https://www.linkedin.com/company/"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin size-5 hover:text-indigo-500"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>

              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-youtube size-6 hover:text-indigo-500"
                  aria-hidden="true"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                  <path d="m10 15 5-3-5-3z"></path>
                </svg>
              </a>
            </div>
            <p className="mt-3 text-center">© 2025 Nextume</p>
          </div>
          <p className="w-full py-3 text-center text-sm text-gray-500">
            Made with <span className="text-red-500">❤️</span> by{" "}
            <a
              href="https://jerin3j.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-700 transition hover:text-violet-600 hover:underline"
            >
              Jerin3j
            </a>
          </p>
        </div>
      </footer>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
    </>
  );
};

export default Footer;
