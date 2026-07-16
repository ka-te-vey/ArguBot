import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { MessageSquare, Plus, Trash2, Sun, Moon, Settings, PanelLeftClose, PanelLeft, Sparkles, LogOut } from "lucide-react";
import { useTheme } from "../components/Theme";

export default function Sidebar({
  isOpen,
  onToggle,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onClearAll
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Mobile Backdrop Overlay when sidebar is open */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      <aside
        className={`fixed md:relative top-0 bottom-0 left-0 z-50 flex flex-col h-full border-r transition-all duration-300 select-none shrink-0 ${
          isOpen ? "w-68 translate-x-0" : "w-0 -translate-x-full md:w-16 md:translate-x-0"
        } ${
          isDark
            ? "bg-[#1E1E1F] border-zinc-800 text-zinc-300"
            : "bg-[#F0F4F9] border-zinc-200 text-zinc-700"
        }`}
      >
        {/* Top Header Row of Sidebar */}
        <div className="h-14 flex items-center justify-between px-4">
          <div className={`flex items-center gap-2 ${!isOpen && "md:hidden"}`}>
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className={`font-display text-base font-extrabold tracking-tight uppercase ${isDark ? "text-white" : "text-zinc-900"}`}>
              ArguBot
            </span>
          </div>
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg hover:bg-zinc-200/55 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-500`}
            title={isOpen ? "Collapse menu" : "Expand menu"}
          >
            {isOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 py-2">
          <button
            onClick={onNewChat}
            className={`flex items-center gap-3 w-full rounded-full transition-all duration-200 cursor-pointer shadow-xs ${
              isOpen
                ? "px-4 py-3 text-sm font-medium"
                : "p-3 justify-center"
            } ${
              isDark
                ? "bg-[#131314] hover:bg-[#282A2D] text-white border border-zinc-800"
                : "bg-[#E1E9F5] hover:bg-[#D3E3FD] text-[#041E49] border border-transparent"
            }`}
          >
            <Plus className="w-5 h-5" />
            {isOpen && <span>New chat</span>}
          </button>
        </div>

        {/* Scrollable Recent Chats Area */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {isOpen && (
            <span className={`text-[10px] font-bold tracking-widest uppercase px-3 block mb-2 ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}>
              Recent debates
            </span>
          )}

          {chats.length === 0 ? (
            isOpen && (
              <div className={`text-xs px-3 py-4 text-center italic ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                No recent chats
              </div>
            )
          ) : (
            chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  id={`recent-chat-${chat.id}`}
                  className={`group relative flex items-center justify-between rounded-full text-xs font-medium cursor-pointer transition-all ${
                    isOpen ? "px-3 py-2.5" : "p-3.5 justify-center"
                  } ${
                    isActive
                      ? isDark
                        ? "bg-[#282A2D] text-white"
                        : "bg-[#D3E3FD] text-[#041E49]"
                      : isDark
                        ? "hover:bg-zinc-800/60 text-zinc-400 hover:text-white"
                        : "hover:bg-zinc-200/60 text-zinc-600 hover:text-zinc-900"
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex items-center gap-3 overflow-hidden pr-6">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    {isOpen && (
                      <span className="truncate max-w-[130px]" title={chat.opinion}>
                        {chat.opinion}
                      </span>
                    )}
                  </div>

                  {isOpen && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="absolute right-3 opacity-0 group-hover:opacity-100 hover:text-red-500 p-1 rounded transition-opacity cursor-pointer"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Actions Row */}
        <div className={`p-3 border-t space-y-1 shrink-0 ${isDark ? "border-zinc-800" : "border-zinc-200/80"}`}>
          {/* Light/Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 w-full rounded-full transition-all cursor-pointer ${
              isOpen ? "px-3 py-2.5 text-xs font-semibold" : "p-3.5 justify-center"
            } ${
              isDark
                ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900"
            }`}
            title={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isOpen && <span>{isDark ? "Light mode" : "Dark mode"}</span>}
          </button>

          {/* Reset All App History Option */}
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to erase all your chat history and start clean?")) {
                onClearAll();
              }
            }}
            className={`flex items-center gap-3 w-full rounded-full transition-all cursor-pointer ${
              isOpen ? "px-3 py-2.5 text-xs font-semibold" : "p-3.5 justify-center"
            } ${
              isDark
                ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900"
            }`}
            title="Clear all chat databases"
          >
            <Settings className="w-4 h-4 animate-spin-hover" />
            {isOpen && <span>Erase history</span>}
          </button>

          {/* User Profile Card */}
          <Link
            to="/signin"
            className={`flex items-center justify-between rounded-2xl transition-all cursor-pointer ${
              isOpen ? "px-3 py-2 hover:bg-red-500/10 hover:text-red-500 group" : "py-2 justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
            title="Sign out"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white">
                  M
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-[#1E1E1F]" />
              </div>
              {isOpen && (
                <div className="overflow-hidden text-left">
                  <p className={`text-xs font-semibold truncate ${isDark ? "text-white group-hover:text-red-400" : "text-zinc-800 group-hover:text-red-600"}`}>
                    Mama
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate font-mono group-hover:text-red-400/80">
                    mamacita1869@gmail.com
                  </p>
                </div>
              )}
            </div>
            {isOpen && (
              <LogOut className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 shrink-0" />
            )}
          </Link>

        </div>
      </aside>
    </>
  );
}
