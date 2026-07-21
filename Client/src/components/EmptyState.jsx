import React from "react";
import { Lightbulb, Sliders, Shield, Trophy, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import { useTheme } from "./Theme";

export function RoundsSelector({ rounds, onSetRounds }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className={`w-full border rounded-2xl p-4 md:p-5 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
      isDark
        ? "bg-[#1E1E1F] border-zinc-800"
        : "bg-white border-zinc-200/90 shadow-xs"
    }`}>
      <div className="flex items-center gap-2.5">
        <HelpCircle className={`w-4.5 h-4.5 shrink-0 ${
          isDark ? "text-[#b3b3ff]" : "text-purple-600"
        }`} />
        <span className={`text-xs md:text-sm font-bold ${
          isDark ? "text-zinc-200" : "text-zinc-800"
        }`}>
          Match Duration (Rounds of Exchanges):
        </span>
      </div>
      <div className={`flex p-1 rounded-full border transition-colors ${
        isDark
          ? "bg-[#131314] border-zinc-800"
          : "bg-zinc-100 border-zinc-200/80"
      }`}>
        {[3, 5, 7].map((r) => (
          <button
            key={r}
            type="button"
            id={`rounds-btn-${r}`}
            onClick={() => onSetRounds(r)}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider transition-all cursor-pointer ${
              rounds === r
                ? isDark
                  ? "argubot-badge shadow-xs"
                  : "bg-purple-600 text-white shadow-md border border-purple-500"
                : isDark
                  ? "text-zinc-400 hover:text-zinc-200"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

const HOW_TO_USE_STEPS = [
  {
    step: "Step 1",
    title: "State Your Opinion",
    description: "Type any statement or opinion you want to test and defend in the input box below.",
    samplePrompt: "Artificial Intelligence will enhance human creativity rather than replace it.",
    icon: "Lightbulb"
  },
  {
    step: "Step 2",
    title: "Select Match Rounds",
    description: "Choose 3, 5, or 7 exchange rounds above to customize the debate intensity.",
    samplePrompt: "Remote work creates a more productive and balanced workforce.",
    icon: "Sliders"
  },
  {
    step: "Step 3",
    title: "Clash & Counter",
    description: "ArguBot will challenge your arguments with sharp logical counterpoints.",
    samplePrompt: "Social media platforms should be regulated like public utilities.",
    icon: "Shield"
  },
  {
    step: "Step 4",
    title: "Receive Your Verdict",
    description: "Finish all exchange rounds to get an official score sheet and logical analysis.",
    samplePrompt: "Critical thinking and logic should be mandatory subjects in all schools.",
    icon: "Trophy"
  }
];

export function SuggestionGrid({ onSelectPrompt }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "Lightbulb":
        return <Lightbulb className="w-4.5 h-4.5" />;
      case "Sliders":
        return <Sliders className="w-4.5 h-4.5" />;
      case "Shield":
        return <Shield className="w-4.5 h-4.5" />;
      case "Trophy":
        return <Trophy className="w-4.5 h-4.5" />;
      default:
        return <Sparkles className="w-4.5 h-4.5" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          How to use ArguBot • Click any card to try it
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 w-full">
        {HOW_TO_USE_STEPS.map((s, idx) => (
          <div
            key={idx}
            id={`how-to-use-step-${idx + 1}`}
            onClick={() => onSelectPrompt(s.samplePrompt)}
            className={`border rounded-2xl p-5 md:p-6 min-h-[175px] cursor-pointer text-left transition-all flex flex-col justify-between group select-none relative hover:-translate-y-1 hover:shadow-lg ${
              isDark
                ? "bg-[#1E1E1F] hover:bg-[#252527] border-zinc-800"
                : "bg-zinc-50 hover:bg-[#EAF1FA] border-zinc-200"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-0.5 rounded-full argubot-badge font-bold">
                  {s.step}
                </span>
                <div className="p-2 rounded-full argubot-icon-circle flex items-center justify-center shadow-xs">
                  {renderIcon(s.icon)}
                </div>
              </div>

              <h4 className={`text-base font-bold mb-1.5 ${isDark ? "text-white" : "text-zinc-900"}`}>
                {s.title}
              </h4>

              <p className={`text-xs md:text-[13px] leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {s.description}
              </p>
            </div>

            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium transition-colors ${
              isDark ? "border-zinc-800 text-purple-400 group-hover:text-purple-300" : "border-zinc-200/80 text-purple-700 group-hover:text-purple-800"
            }`}>
              <span className="truncate italic">Try: "{s.samplePrompt}"</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

