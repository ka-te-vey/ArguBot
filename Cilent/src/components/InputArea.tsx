import { useState, useRef, FormEvent, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Paperclip, Mic, Image, ArrowUp } from "lucide-react";

interface InputAreaProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isThinking: boolean;
  placeholder: string;
  disabled: boolean;
  theme: "dark" | "light";
}

export default function InputArea({
  value,
  onChange,
  onSubmit,
  isThinking,
  placeholder,
  disabled,
  theme
}: InputAreaProps) {
  const isDark = theme === "dark";
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled && !isThinking) {
        onSubmit();
      }
    }
  };

  const hasContent = value.trim().length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-6 md:pb-8 shrink-0 relative z-20 select-none">
      <div className={`relative flex flex-col rounded-[28px] px-5 py-3 shadow-xs border transition-all ${
        isDark
          ? "bg-[#1E1E1F] border-transparent focus-within:border-zinc-700 focus-within:bg-[#202124]"
          : "bg-[#F0F4F9] border-transparent focus-within:border-zinc-300 focus-within:bg-white focus-within:shadow-md"
      }`}>
        {/* Input Text Row */}
        <textarea
          ref={textareaRef}
          id="chat-input"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isThinking}
          placeholder={placeholder}
          className={`w-full bg-transparent border-none outline-none resize-none text-[15px] max-h-36 min-h-[24px] pr-12 pt-1 transition-all ${
            isDark ? "text-[#E3E3E3] placeholder-zinc-500" : "text-[#1F1F1F] placeholder-zinc-400"
          }`}
          style={{ height: "auto" }}
        />

        {/* Bottom Actions Row inside Capsule */}
        <div className="flex items-center justify-between mt-3 pt-1 border-t border-transparent">
          {/* Inline Attachment & Feature Tools */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className={`p-2 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200`}
              title="Attach files"
              onClick={() => alert("File uploads can be integrated here. Ready in production!")}
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              className={`p-2 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200`}
              title="Use microphone"
              onClick={() => alert("Voice transcription can be integrated here. Ready in production!")}
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="button"
              className={`p-2 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200`}
              title="Upload image"
              onClick={() => alert("Image analysis can be integrated here. Ready in production!")}
            >
              <Image className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Send Button, only enters/shows when text is typed */}
          <div className="h-9 w-9 flex items-center justify-center">
            <AnimatePresence>
              {hasContent && (
                <motion.button
                  key="send-btn"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  id="send-message-btn"
                  type="button"
                  onClick={onSubmit}
                  className="p-2 rounded-full gemini-gradient-bg text-white shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                  title="Send counterpoint"
                >
                  <ArrowUp className="w-4 h-4 stroke-[3px]" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Humble footnote */}
      <p className={`text-[10px] text-center mt-2 font-medium tracking-wide ${
        isDark ? "text-zinc-600" : "text-zinc-400"
      }`}>
        ArguBot may formulate ruthless counters. Double-check its rhetoric.
      </p>
    </div>
  );
}
