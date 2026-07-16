import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Sparkles } from "lucide-react";
import { useTheme } from "../components/Theme";

export default function SignUp() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service.");
      return;
    }
    setError("");
    setIsLoading(true);

    // Mock authentication delay
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className={`min-h-screen w-screen flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans transition-colors duration-300 select-none ${
      isDark ? "bg-[#131314] text-[#E3E3E3]" : "bg-[#F8F9FA] text-[#1F1F1F]"
    }`}>
      
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md p-8 md:p-10 rounded-3xl border shadow-xl backdrop-blur-md z-10 transition-all ${
          isDark 
            ? "bg-[#1E1E1F]/60 border-zinc-800/80 shadow-black/20" 
            : "bg-white/80 border-zinc-200/80 shadow-zinc-200/50"
        }`}
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 mb-3 border border-zinc-200/35 dark:border-zinc-700/35">
            <Sparkles className="w-6.5 h-6.5 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" style={{ fill: "url(#brand-glow-up)" }} />
            <svg width="0" height="0" className="absolute">
              <linearGradient id="brand-glow-up" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4285F4" />
                <stop offset="50%" stopColor="#9B72CB" />
                <stop offset="100%" stopColor="#D96570" />
              </linearGradient>
            </svg>
          </div>
          <span className="font-display text-lg font-black tracking-widest uppercase bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-1">
            ArguBot
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Create account
          </h2>
          <p className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            Register details to begin your critical thinking path.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl text-xs font-medium border bg-red-500/10 border-red-500/30 text-red-500 flex items-start gap-2.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Username Field */}
          <div className="space-y-1">
            <label htmlFor="name" className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Debater Name
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <User className="w-4 h-4" />
              </span>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Socrates"
                className={`w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border ${
                  isDark ? "border-zinc-800 focus:border-purple-500" : "border-zinc-200 focus:border-purple-500"
                } rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-sm`}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="email" className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className={`w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border ${
                  isDark ? "border-zinc-800 focus:border-purple-500" : "border-zinc-200 focus:border-purple-500"
                } rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-sm`}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="password" className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-11 py-2 bg-zinc-50 dark:bg-zinc-900 border ${
                  isDark ? "border-zinc-800 focus:border-purple-500" : "border-zinc-200 focus:border-purple-500"
                } rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-sm`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-250 cursor-pointer"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-11 py-2 bg-zinc-50 dark:bg-zinc-900 border ${
                  isDark ? "border-zinc-800 focus:border-purple-500" : "border-zinc-200 focus:border-purple-500"
                } rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-sm`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-250 cursor-pointer"
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Agree to Terms */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="agree"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-purple-500 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded focus:ring-purple-500 cursor-pointer"
            />
            <label htmlFor="agree" className={`text-xs cursor-pointer select-none leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              I agree to the{" "}
              <a href="#terms" onClick={(e) => e.preventDefault()} className="text-purple-500 hover:text-purple-400 font-bold">Terms</a>
              {" "}and{" "}
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-purple-500 hover:text-purple-400 font-bold">Privacy</a>.
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 gemini-gradient-bg hover:opacity-90 active:opacity-95 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-purple-500/10 flex items-center justify-center gap-2 cursor-pointer ${
              isLoading && "opacity-75 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-3">
          <div className={`w-full border-t ${isDark ? "border-zinc-800" : "border-zinc-200"}`} />
          <span className={`absolute px-4 text-[9px] font-extrabold tracking-widest uppercase ${isDark ? "bg-[#1C1C1D] text-zinc-500" : "bg-[#FDFDFD] text-zinc-400"}`}>
            Or Continue with
          </span>
        </div>

        {/* Social SSO Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {}}
            className={`py-2.5 px-4 border ${
              isDark ? "border-zinc-800 hover:bg-zinc-900/60 bg-zinc-900/30" : "border-zinc-200 hover:bg-zinc-50 bg-zinc-50/20"
            } rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer`}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.84-2.45 2.4l3.79 2.94c2.22-2.05 3.51-5.07 3.51-8.52z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.79-2.94c-1.05.7-2.4.12-4.17.12-3.21 0-5.93-2.17-6.9-5.1H1.17v3.02C3.18 20.12 7.24 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.1 13.17c-.25-.7-.39-1.45-.39-2.22s.14-1.52.39-2.22V5.71H1.17C.42 7.2.01 8.8.01 10.95c0 2.15.41 3.75 1.16 5.24l3.93-3.02z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.24 0 3.18 3.88 1.17 7.93l3.93 3.02c.97-2.93 3.69-5.2 6.9-5.2z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            onClick={() => {}}
            className={`py-2.5 px-4 border ${
              isDark ? "border-zinc-800 hover:bg-zinc-900/60 bg-zinc-900/30" : "border-zinc-200 hover:bg-zinc-50 bg-zinc-50/20"
            } rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer`}
          >
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <span className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Already a debater?{" "}
          </span>
          <Link
            to="/signin"
            className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-85 transition-opacity"
          >
            Sign in here
          </Link>
        </div>
      </motion.div>

      {/* Outer brand footer */}
      <span className={`text-[10px] font-mono tracking-wide absolute bottom-6 z-10 ${
        isDark ? "text-zinc-650" : "text-zinc-400"
      }`}>
        © {new Date().getFullYear()} ArguBot Arena. All intellectual arguments preserved.
      </span>
    </div>
  );
}
