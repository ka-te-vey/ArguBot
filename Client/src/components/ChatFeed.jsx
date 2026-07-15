import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trophy, ArrowRight, User } from "lucide-react";

// Word-by-word streaming text component
function StreamingText({ text, active }) {
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

export default function ChatFeed({
  history,
  isThinking,
  totalRounds,
  onEndDebate,
  theme
}) {
  const messagesEndRef = useRef(null);
  const isDark = theme === "dark";

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isThinking]);

  // Determine exchange numbers
  const userMessages = history.filter((m) => m.role === "user");
  const currentRound = Math.min(userMessages.length, totalRounds);
  const isDebateFullyComplete = userMessages.length >= totalRounds && history[history.length - 1]?.role === "ai";

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 md:px-8 w-full select-text">
      {/* Scrollable chat body */}
      <div className="w-full max-w-2xl mx-auto py-6 space-y-8 flex-1">
        <AnimatePresence initial={false}>
          {history.map((msg, index) => {
            const isUser = msg.role === "user";
            const isLastMessage = index === history.length - 1;
            // Only stream if it's the last AI message AND it is fresh (within last 15 seconds)
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
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800/40 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800">
                    <Sparkles className="w-4 h-4 text-purple-500" />
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
                      <span className={`text-[9px] font-mono tracking-wider text-zinc-400 mt-1 mr-2 uppercase`}>
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
                      <span className={`text-[9px] font-mono tracking-wider text-zinc-400 mt-2 uppercase`}>
                        ArguBot Counterpoint
                      </span>
                    </div>
                  )}
                </div>

                {/* User Icon on Right */}
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/10 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800">
                    <User className={`w-4 h-4 ${isDark ? "text-zinc-300" : "text-zinc-600"}`} />
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* AI Thinking / Formulating */}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-4 w-full justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800/40 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800">
                <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
              </div>
              <div className="flex flex-col space-y-2 w-full max-w-[70%]">
                {/* Modern shimmer line placeholder bars representing thinking */}
                <div className="h-4 w-full rounded-full shimmer" />
                <div className="h-4 w-[85%] rounded-full shimmer" style={{ animationDelay: "200ms" }} />
                <div className="h-4 w-[50%] rounded-full shimmer" style={{ animationDelay: "400ms" }} />
              </div>
            </motion.div>
          )}

          {/* Debate Completed Transition Card */}
          {isDebateFullyComplete && !isThinking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className={`rounded-2xl p-6 text-center border mt-8 transition-all ${
                isDark 
                  ? "bg-[#1E1E1F] border-zinc-800" 
                  : "bg-zinc-50 border-zinc-200"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className={`text-base font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>
                Debate Finalized
              </h3>
              <p className={`text-xs mb-5 max-w-sm mx-auto leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                The round of {totalRounds} exchanges is complete. Let the official referee assess your logical rigor and compile the score.
              </p>
              <button
                id="goto-verdict-btn"
                type="button"
                onClick={onEndDebate}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer transition-all shadow-md hover:opacity-95"
              >
                Analyze Verdict
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
