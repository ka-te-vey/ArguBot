import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { RoundsSelector, SuggestionGrid } from "../components/EmptyState";
import { useTheme } from "../components/Theme";

export default function Dashboard({ user, onSelectPrompt, rounds, onSetRounds }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const userName = user?.name || "debater";

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-6 md:py-16 px-4 max-w-2xl mx-auto w-full select-none">
      {/* Centered Sparkles Animated Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full argubot-logo-circle shadow-lg">
          <Sparkles className="w-8 h-8 text-[#b3b3ff] animate-pulse" />
        </div>
      </motion.div>

      {/* Main welcome titles */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-10 space-y-2"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight select-none">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(to bottom, #9900ff 0%, #99ff99 100%)",
            }}
          >
            Hello, {userName}!
          </span>
        </h1>
        <p className={`text-lg md:text-xl font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
          What opinion are you ready to defend today?
        </p>
      </motion.div>

      {/* Match duration selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full"
      >
        <RoundsSelector rounds={rounds} onSetRounds={onSetRounds} />
      </motion.div>

      {/* Suggested chips 2x2 grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="w-full"
      >
        <SuggestionGrid onSelectPrompt={onSelectPrompt} />
      </motion.div>
    </div>
  );
}
