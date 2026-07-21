import React from "react";
import { Lightbulb, TrendingUp } from "lucide-react";
import { useTheme } from "./Theme";

export function ScoreGauge({ score }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className={`relative flex flex-col items-center justify-center mb-8 h-32 w-32 rounded-full border shadow-inner transition-colors ${
      isDark ? "bg-[#131314] border-zinc-800" : "bg-white border-zinc-200"
    }`}>
      {/* Signature outer gradient halo */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse blur-sm" />
      <span className={`font-mono text-[9px] uppercase tracking-wider relative z-10 font-bold ${
        isDark ? "text-zinc-500" : "text-black"
      }`}>
        SCORE
      </span>
      <div className="flex items-baseline gap-0.5 relative z-10">
        <span className={`text-5xl font-black tracking-tight ${
          isDark ? "text-white" : "text-black"
        }`}>
          {score || 0}
        </span>
        <span className={`font-mono text-xs font-bold ${
          isDark ? "text-zinc-500" : "text-black"
        }`}>
          /10
        </span>
      </div>
    </div>
  );
}

export function FeedbackDetails({ advice, improvement }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-6 w-full text-left space-y-6">
      <div>
        <span className="text-[10px] font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5 font-bold">
          <Lightbulb className="w-3.5 h-3.5 text-blue-500" />
          Constructive Advice
        </span>
        <p className={`text-[15px] leading-relaxed font-normal ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
          {advice}
        </p>
      </div>

      {improvement && (
        <div className={`border rounded-2xl p-4 md:p-5 transition-all ${
          isDark ? "bg-[#282A2D] border-zinc-700/55" : "bg-[#F0F4F9] border-blue-100"
        }`}>
          <span className="text-[10px] font-mono text-pink-500 dark:text-pink-400 uppercase tracking-widest block mb-2.5 flex items-center gap-1.5 font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-pink-500" />
            What to Improve On
          </span>
          <p className={`text-[14px] leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
            {improvement}
          </p>
        </div>
      )}
    </div>
  );
}
