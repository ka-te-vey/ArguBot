import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, RotateCcw, AlertCircle, Clipboard, Check, MessageSquare } from "lucide-react";
import { ScoreGauge, FeedbackDetails } from "../components/ScoreScreen";
import { useTheme } from "../components/Theme";

const LOADING_PHASES = [
  "Evaluating logical coherence...",
  "Analyzing counter-argument precision...",
  "Assessing rhetorical conviction...",
  "Formatting constructive feedback...",
  "Generating final debate scores..."
];

export default function ReviewAndVerdict({
  activeChat,
  isCalculatingScore,
  handleNewChat,
  handleDebateBack
}) {
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Cycle through loading phases
  useEffect(() => {
    if (!isCalculatingScore) return;
    const interval = setInterval(() => {
      setLoadingPhase((prev) => (prev + 1) % LOADING_PHASES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [isCalculatingScore]);

  const handleCopyVerdict = () => {
    if (activeChat.score) {
      const shareText = `⚔️ ArguBot Debate Verdict ⚔️\nScore: ${activeChat.score.score || "N/A"}/10\nAdvice: ${activeChat.score.advice}\nImprovement: ${activeChat.score.improvement}\n\nCan you argue better? Test your wits on ArguBot!`;
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isCalculatingScore) {
    return (
      <div className="w-full max-w-md mx-auto px-6 py-16 flex flex-col items-center justify-center min-h-[50vh] text-center">
        {/* Animated loader */}
        <div className="relative mb-8 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 rounded-full border-4 border-zinc-100 dark:border-zinc-800 border-t-purple-500 border-b-blue-500 animate-spin"
          />
          <div className="absolute w-8 h-8 rounded-full bg-transparent flex items-center justify-center">
            <Award className="w-4 h-4 text-purple-500" />
          </div>
        </div>

        <span className="text-[10px] font-mono tracking-widest uppercase text-purple-500 font-bold mb-3">
          ArguBot Evaluation
        </span>

        <AnimatePresence mode="wait">
          <motion.p
            key={loadingPhase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className={`text-sm font-medium h-12 leading-relaxed max-w-xs ${
              isDark ? "text-zinc-300" : "text-zinc-700"
            }`}
          >
            {LOADING_PHASES[loadingPhase]}
          </motion.p>
        </AnimatePresence>

        <div className="w-44 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-6">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 11, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          />
        </div>
      </div>
    );
  }

  if (!activeChat.score) {
    return (
      <div className={`w-full max-w-md mx-auto px-6 py-16 text-center border rounded-2xl shadow-xl transition-all ${
        isDark ? "bg-[#1E1E1F] border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900"
      }`}>
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold tracking-tight">Evaluation Unfinished</h3>
        <p className={`text-sm mt-2 leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          We were unable to compile the score sheets. Please reset and start a new debate chat.
        </p>
        <button
          id="failed-reset-btn"
          type="button"
          onClick={handleNewChat}
          className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md hover:opacity-95"
        >
          Return to Arena Setup
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 md:py-8 flex flex-col justify-start">
      {/* Title block */}
      <div className="text-center mb-8">
        <span className="text-[10px] font-mono text-purple-500 uppercase tracking-widest font-black block mb-1">
          THE DECISION ROOM
        </span>
        <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight select-none leading-none ${
          isDark ? "text-white" : "text-zinc-900"
        }`}>
          Performance Card
        </h1>
      </div>

      {/* Main Verdict Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`border rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden mb-6 transition-all ${
          isDark ? "bg-[#1E1E1F] border-zinc-800" : "bg-[#FFFFFF] border-zinc-200"
        }`}
      >
        <div className="flex flex-col items-center">
          <ScoreGauge score={activeChat.score.score} />
          <FeedbackDetails
            advice={activeChat.score.advice}
            improvement={activeChat.score.improvement}
          />
        </div>
      </motion.div>

      {/* Primary Action Row */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          id="copy-verdict-btn"
          type="button"
          onClick={handleCopyVerdict}
          className={`flex-1 py-3 px-5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            isDark
              ? "border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-300"
              : "border-zinc-300 bg-transparent hover:bg-zinc-100 text-zinc-600"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Clipboard className="w-4 h-4" />
              Share Verdict
            </>
          )}
        </button>

        {activeChat.totalRounds === 3 && handleDebateBack && (
          <button
            id="debate-back-btn"
            type="button"
            onClick={handleDebateBack}
            className="flex-1 py-3 px-5 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Debate Back
          </button>
        )}

        <button
          id="debate-again-btn"
          type="button"
          onClick={handleNewChat}
          className="flex-1 py-3 px-5 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-95 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/10"
        >
          <RotateCcw className="w-4 h-4 animate-spin-slow" />
          New Chat
        </button>
      </div>
    </div>
  );
}
