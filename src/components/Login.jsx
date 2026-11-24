
import React, { useState } from "react";
import {
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf6] text-gray-800">

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">

        {/* Login Card */}
        <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-9">

          {/* Heading */}
          <div className="text-center mb-7">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#105443]">
              Admin Login
            </h2>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Enter your credentials to access your online portal
            </p>
          </div>

          {/* Username */}
          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Username
            </label>

            <div className="flex items-center border border-gray-300 rounded-xl px-4 h-12 sm:h-[50px] focus-within:border-[#105443] transition-colors">
              <UserRound
                size={19}
                className="text-gray-500 mr-3 shrink-0"
              />

              <input
                type="text"
                placeholder="Enter your Username"
                className="w-full outline-none bg-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold">
                Password
              </label>

              <a
                href="#"
                className="text-sm text-[#b89635] hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <div className="flex items-center border border-gray-300 rounded-xl px-4 h-12 sm:h-[50px] focus-within:border-[#105443] transition-colors">
              <LockKeyhole
                size={19}
                className="text-gray-500 mr-3 shrink-0"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                className="w-full outline-none bg-transparent text-sm sm:text-base"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500 hover:text-[#105443] transition-colors shrink-0"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 mb-7">
            <input
              type="checkbox"
              id="rememberMe"
              className="w-4 h-4 accent-[#105443]"
            />

            <label htmlFor="rememberMe" className="text-sm sm:text-base">
              Remember Me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="button"
            className="w-full h-12 sm:h-[50px] rounded-xl bg-[#07523f] hover:bg-[#063f31] text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            Sign In to Portal
            <ArrowRight size={20} />
          </button>

          {/* Help Links */}
          <div className="border-t border-gray-200 mt-7 pt-5 text-center text-sm text-gray-500">
            Need assistance?{" "}

            <a
              href="https://comjoyinfo.co.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#105443] hover:underline"
            >
              Contact IT Support
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Login;
