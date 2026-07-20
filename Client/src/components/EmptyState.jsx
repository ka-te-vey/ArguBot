import React from "react";
import { Sparkles, Laptop, Cat, Pizza, GraduationCap, HelpCircle } from "lucide-react";
import { useTheme } from "./Theme";

export function RoundsSelector({ rounds, onSetRounds }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className={`w-full border rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 ${
      isDark ? "bg-[#1E1E1F] border-zinc-800" : "bg-zinc-50 border-zinc-200"
    }`}>
      <div className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-[#b3b3ff] shrink-0" />
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
                ? "argubot-badge shadow-xs"
                : `text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300`
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  { id: "1", text: "Pineapple absolutely belongs on pizza.", category: "Taste & Culture", icon: "Pizza" },
  { id: "2", text: "Remote work is vastly superior to in-office work for creative careers.", category: "Workforce", icon: "Laptop" },
  { id: "3", text: "Cats are objectively better, lower-maintenance companions than dogs.", category: "Lifestyle", icon: "Cat" },
  { id: "4", text: "AI is a force that will permanently replace human artists and writers.", category: "Technology", icon: "Sparkles" }
];

export function SuggestionGrid({ onSelectPrompt }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "Pizza":
        return <Pizza className="w-4 h-4" />;
      case "Laptop":
        return <Laptop className="w-4 h-4" />;
      case "Cat":
        return <Cat className="w-4 h-4" />;
      case "Sparkles":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <GraduationCap className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {SUGGESTIONS.map((s) => (
        <div
          key={s.id}
          id={`suggestion-${s.id}`}
          onClick={() => onSelectPrompt(s.text)}
          className={`border rounded-2xl p-4.5 cursor-pointer text-left transition-all flex flex-col justify-between h-32 group select-none relative hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] ${
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
            <span className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full argubot-badge font-bold">
              {s.category}
            </span>
            <div className="p-2 rounded-full argubot-icon-circle flex items-center justify-center shadow-xs">
              {renderIcon(s.icon || "")}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
