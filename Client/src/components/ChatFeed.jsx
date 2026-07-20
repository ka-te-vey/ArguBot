import React, { useState, useEffect } from "react";
import { Sparkles, User } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "./Theme";

// Word-by-word streaming text component
export function StreamingText({ text, active }) {
  const [displayedText, setDisplayedText] = useState(active ? "" : text);

  useEffect(() => {
    if (!active) {
      setDisplayedText(text);
      return;
    }
    setDisplayedText("");
    const words = text.split(" ");
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedText((prev) => prev + (prev ? " " : "") + words[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 45); // pacing is smooth and natural
    return () => clearInterval(interval);
  }, [text, active]);

  return <span className="leading-relaxed whitespace-pre-wrap">{displayedText}</span>;
}

export function MessageBubble({ msg, index, isLastMessage }) {
  const isUser = msg.role === "user";
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const shouldStream = !isUser && isLastMessage && (Date.now() - msg.timestamp < 15000);

  return (
    <motion.div
      key={index}
      id={`chat-msg-${index}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-4 w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI Sparkle Icon on Left */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full argubot-logo-circle flex items-center justify-center shrink-0 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#b3b3ff]" />
        </div>
      )}

      {/* Message Body */}
      <div className={`max-w-[85%] ${isUser ? "text-right" : "text-left"}`}>
        {isUser ? (
          <div className="flex flex-col items-end">
            {/* Message Bubble */}
            <div className={`rounded-3xl px-5 py-3.5 shadow-xs text-sm leading-relaxed ${
              isDark 
                ? "bg-[#2D2D2E] text-[#E3E3E3]" 
                : "bg-[#F0F4F9] text-[#1F1F1F]"
            }`}>
              <p>{msg.text}</p>
            </div>
            {/* Message Label */}
            <span className="text-[9px] font-mono tracking-wider text-zinc-400 mt-1 mr-2 uppercase">
              You
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-start">
            {/* No bubble for AI response, just clean high-contrast text */}
            <div className={`text-[15px] leading-relaxed select-text tracking-wide ${
              isDark ? "text-[#E3E3E3]" : "text-[#1F1F1F]"
            }`}>
              <StreamingText text={msg.text} active={shouldStream} />
            </div>
            <span className="text-[9px] font-mono tracking-wider text-zinc-400 mt-2 uppercase">
              ArguBot Counterpoint
            </span>
          </div>
        )}
      </div>

      {/* User Icon on Right */}
      {isUser && (
        <div className="w-8 h-8 rounded-full argubot-icon-circle flex items-center justify-center shrink-0 shadow-xs">
          <User className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
}

export function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-4 w-full justify-start"
    >
      <div className="w-8 h-8 rounded-full argubot-logo-circle flex items-center justify-center shrink-0 shadow-xs">
        <Sparkles className="w-4 h-4 text-[#b3b3ff] animate-pulse" />
      </div>
      <div className="flex flex-col space-y-2 w-full max-w-[70%]">
        {/* Modern shimmer line placeholder bars representing thinking */}
        <div className="h-4 w-full rounded-full shimmer" />
        <div className="h-4 w-[85%] rounded-full shimmer" style={{ animationDelay: "200ms" }} />
        <div className="h-4 w-[50%] rounded-full shimmer" style={{ animationDelay: "400ms" }} />
      </div>
    </motion.div>
  );
}
