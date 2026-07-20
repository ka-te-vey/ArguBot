import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Mail, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { useTheme } from "../components/Theme";

export default function ForgotPassword() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic email validation
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsLoading(true);

    // call backend API
    try {
      const response = await fetch("http://localhost:3000/api/auth/Forgot-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // handle error
      if (!response.ok) {
        setError(data.message || 'Failed to send reset code!');
        return;
      }

      // success -> navigate directly to verify code page
      navigate('/verify-code');
    } catch (error) {
      console.error('Forgot Password error: ', error);
      // Navigate to verify-code for smooth client UI testing
      navigate('/verify-code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-screen flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans transition-colors duration-300 select-none ${
        isDark ? "bg-[#131314] text-[#E3E3E3]" : "bg-[#F8F9FA] text-[#1F1F1F]"
      }`}
    >
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />

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
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl argubot-logo-circle mb-3 shadow-md">
            <Sparkles className="w-6.5 h-6.5 text-[#b3b3ff]" />
          </div>
          <span className="font-display text-lg font-black tracking-widest uppercase bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-1">
            ArguBot
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {isSubmitted ? "Check your email" : "Reset Password"}
          </h2>
          <p className={`text-xs mt-1 text-center ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            {isSubmitted
              ? `We sent a password reset link to ${email}`
              : "Enter your email address and we'll send you instructions to reset your password."}
          </p>
        </div>

        {isSubmitted ? (
          /* Confirmation Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <div className="flex justify-center my-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <CheckCircle2 className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              Did not receive the email? Check your spam folder or try requesting a reset again.
            </p>

            <div className="space-y-3 pt-2">
              <Link
                to="/verify-code"
                className="w-full py-3 argubot-cta-btn font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className={`w-full py-2.5 px-4 border ${
                  isDark
                    ? "border-zinc-800 hover:bg-zinc-900/60 bg-zinc-900/30"
                    : "border-zinc-200 hover:bg-zinc-50 bg-zinc-50/20"
                } rounded-xl text-xs font-bold transition-all cursor-pointer`}
              >
                Re-enter Email
              </button>

              <div className="text-center pt-1">
                <Link
                  to="/signin"
                  className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                    isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
                  } transition-colors`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Reset Form */
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
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
                  className={`w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border ${
                    isDark ? "border-zinc-800 focus:border-purple-500" : "border-zinc-200 focus:border-purple-500"
                  } rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-sm`}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 argubot-cta-btn font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isLoading && "opacity-75 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {/* Back to Sign In Link */}
            <div className="text-center pt-2">
              <Link
                to="/signin"
                className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                  isDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
                } transition-colors`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </motion.div>

      {/* Outer brand footer */}
      <span
        className={`text-[10px] font-mono tracking-wide absolute bottom-6 z-10 ${
          isDark ? "text-zinc-650" : "text-zinc-400"
        }`}
      >
        © {new Date().getFullYear()} ArguBot Arena. All intellectual arguments preserved.
      </span>
    </div>
  );
}
