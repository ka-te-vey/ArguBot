import React, { useEffect, useRef } from "react";
import { Trophy, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MessageBubble, ThinkingIndicator } from "../components/ChatFeed";
import { useTheme } from "../components/Theme";

export default function ChatBot({ activeChat, isThinking, handleTriggerScoring }) {
  const messagesEndRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.history, isThinking]);

  // Determine exchange numbers
  const userMessages = activeChat.history.filter((m) => m.role === "user");
  const isDebateFullyComplete = userMessages.length >= activeChat.totalRounds && activeChat.history[activeChat.history.length - 1]?.role === "ai";

  return (
    <div className="flex-1 flex flex-col overflow-hidden w-full">
      {/* Active Opinion Banner */}
      <div className={`px-4 md:px-8 py-3 border-b text-xs md:text-sm select-none transition-colors shrink-0 text-center font-medium ${
        isDark ? "bg-zinc-900/30 border-zinc-850 text-zinc-400" : "bg-zinc-50 border-zinc-100 text-zinc-500"
      }`}>
        Debating: <span className="italic">"{activeChat.opinion}"</span>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto px-4 md:px-8 w-full select-text">
        {/* Scrollable chat body */}
        <div className="w-full max-w-2xl mx-auto py-6 space-y-8 flex-1">
          <AnimatePresence initial={false}>
            {activeChat.history.map((msg, index) => (
              <MessageBubble
                key={index}
                msg={msg}
                index={index}
                isLastMessage={index === activeChat.history.length - 1}
              />
            ))}

            {/* AI Thinking / Formulating */}
            {isThinking && <ThinkingIndicator />}

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
                  The round of {activeChat.totalRounds} exchanges is complete. Let the official referee assess your logical rigor and compile the score.
                </p>
                <button
                  id="goto-verdict-btn"
                  type="button"
                  onClick={handleTriggerScoring}
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
    </div>
  );
}
