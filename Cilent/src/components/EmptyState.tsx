import { motion } from "motion/react";
import { Sparkles, Laptop, Cat, Pizza, GraduationCap, HelpCircle } from "lucide-react";
import { ExampleOpinion } from "../types";

interface EmptyStateProps {
  onSelectPrompt: (text: string) => void;
  rounds: number;
  onSetRounds: (rounds: number) => void;
  theme: "dark" | "light";
}

const SUGGESTIONS: ExampleOpinion[] = [
  { id: "1", text: "Pineapple absolutely belongs on pizza.", category: "Taste & Culture", icon: "Pizza" },
  { id: "2", text: "Remote work is vastly superior to in-office work for creative careers.", category: "Workforce", icon: "Laptop" },
  { id: "3", text: "Cats are objectively better, lower-maintenance companions than dogs.", category: "Lifestyle", icon: "Cat" },
  { id: "4", text: "AI is a force that will permanently replace human artists and writers.", category: "Technology", icon: "Sparkles" }
];

export default function EmptyState({ onSelectPrompt, rounds, onSetRounds, theme }: EmptyStateProps) {
  const isDark = theme === "dark";

  // Helper to render lucide icon dynamically
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Pizza":
        return <Pizza className="w-5 h-5 text-amber-500" />;
      case "Laptop":
        return <Laptop className="w-5 h-5 text-blue-500" />;
      case "Cat":
        return <Cat className="w-5 h-5 text-orange-500" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      default:
        return <GraduationCap className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-6 md:py-16 px-4 max-w-2xl mx-auto w-full select-none">
      {/* Centered Sparkles Animated Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800/40">
          <Sparkles className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse" style={{ fill: "url(#gemini-gradient)" }} />
          {/* Custom inline SVG gradient mapping for the icons if needed */}
          <svg width="0" height="0" className="absolute">
            <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="50%" stopColor="#9B72CB" />
              <stop offset="100%" stopColor="#D96570" />
            </linearGradient>
          </svg>
        </div>
      </motion.div>

      {/* Main welcome titles */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-10 space-y-2"
      >
        <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight select-none`}>
          <span className="gemini-gradient-text animate-gradient bg-300%">Hello, mama!</span>
        </h1>
        <p className={`text-lg md:text-xl font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
          What opinion are you ready to defend today?
        </p>
      </motion.div>

      {/* Match duration selector styled beautifully as inline pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`w-full border rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDark ? "bg-[#1E1E1F] border-zinc-800" : "bg-zinc-50 border-zinc-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-purple-500 shrink-0" />
          <span className={`text-xs font-semibold ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
            Match Duration (Rounds of Exchanges):
          </span>
        </div>
        <div className="flex bg-zinc-200 dark:bg-[#131314] p-1 rounded-full border border-transparent dark:border-zinc-800">
          {[3, 5, 7].map((r) => (
            <button
              key={r}
              type="button"
              id={`rounds-btn-${r}`}
              onClick={() => onSetRounds(r)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer ${
                rounds === r
                  ? "bg-white dark:bg-[#282A2D] text-purple-600 dark:text-purple-400 shadow-xs"
                  : `text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300`
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Suggested chips 2x2 grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
      >
        {SUGGESTIONS.map((s, idx) => (
          <motion.div
            key={s.id}
            id={`suggestion-${s.id}`}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectPrompt(s.text)}
            className={`border rounded-2xl p-4.5 cursor-pointer text-left transition-all flex flex-col justify-between h-32 group select-none relative ${
              isDark
                ? "bg-[#1E1E1F] hover:bg-[#282A2D] border-zinc-800"
                : "bg-zinc-50 hover:bg-[#E3EBF5] border-zinc-200"
            }`}
          >
            <p className={`text-[13px] leading-relaxed line-clamp-3 font-medium transition-colors ${
              isDark ? "text-zinc-300 group-hover:text-white" : "text-zinc-700 group-hover:text-zinc-900"
            }`}>
              "{s.text}"
            </p>

            <div className="flex justify-between items-center mt-3">
              <span className={`text-[9px] font-mono tracking-widest uppercase ${
                isDark ? "text-zinc-500" : "text-zinc-400"
              }`}>
                {s.category}
              </span>
              <div className={`p-1.5 rounded-full transition-colors ${
                isDark ? "bg-[#131314] group-hover:bg-[#1E1E1F]" : "bg-white group-hover:bg-zinc-100"
              }`}>
                {renderIcon(s.icon || "")}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
