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
  onClearAll,
  user
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const userName = user?.name || "Guest Debater";
  const userEmail = user?.email || "user@argubot.ai";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "";

  return (
    <>
      {/* Mobile Backdrop Overlay when sidebar is open */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      <aside
        className={`fixed md:relative top-0 bottom-0 left-0 z-50 flex flex-col h-full border-r transition-all duration-300 ease-in-out select-none shrink-0 overflow-hidden ${
          isOpen ? "w-[260px] translate-x-0" : "w-0 -translate-x-full md:w-20 md:translate-x-0"
        } ${
          isDark
            ? "bg-[#1E1E1F] border-zinc-800 text-zinc-300"
            : "bg-[#F0F4F9] border-zinc-200 text-zinc-700"
        }`}
      >
        {/* Top Header Row of Sidebar */}
        <div className="h-14 flex items-center justify-between px-4 shrink-0 border-b border-transparent">
          <div className={`flex items-center gap-2.5 overflow-hidden whitespace-nowrap transition-all duration-300 ${
            isOpen ? "opacity-100 max-w-[180px]" : "opacity-0 max-w-0"
          }`}>
            <div className="w-7 h-7 rounded-full argubot-logo-circle flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className={`font-display text-sm font-extrabold tracking-tight uppercase ${isDark ? "text-white" : "text-zinc-900"}`}>
              Chat History
            </span>
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-zinc-200/55 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-500 shrink-0"
            title={isOpen ? "Collapse menu" : "Expand menu"}
          >
            {isOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 py-3 shrink-0">
          <button
            onClick={onNewChat}
            className={`flex items-center w-full rounded-full transition-all duration-300 cursor-pointer shadow-xs argubot-cta-btn overflow-hidden whitespace-nowrap ${
              isOpen
                ? "px-4 py-2.5 gap-3 text-sm font-medium justify-start"
                : "p-3 justify-center"
            }`}
            title="New chat"
          >
            <Plus className="w-5 h-5 shrink-0" />
            {isOpen && <span className="truncate">New chat</span>}
          </button>
        </div>

        {/* Scrollable Recent Chats Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-1">
          {isOpen && (
            <span className={`text-[10px] font-bold tracking-widest uppercase px-3 block mb-2 whitespace-nowrap ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}>
              Recent debates
            </span>
          )}

          {chats.length === 0 ? (
            isOpen && (
              <div className={`text-xs px-3 py-4 text-center italic whitespace-nowrap ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
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
                  className={`group relative flex items-center rounded-full text-xs font-medium cursor-pointer transition-all duration-200 ${
                    isOpen ? "px-3.5 py-2.5 justify-between gap-2" : "p-3.5 justify-center"
                  } ${
                    isActive
                      ? isDark
                        ? "bg-[#282A2D] text-white font-semibold"
                        : "bg-[#D3E3FD] text-[#041E49] font-semibold"
                      : isDark
                        ? "hover:bg-zinc-800/60 text-zinc-400 hover:text-white"
                        : "hover:bg-zinc-200/60 text-zinc-600 hover:text-zinc-900"
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                  title={chat.opinion}
                >
                  <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    {isOpen && (
                      <span className="truncate whitespace-nowrap text-xs">
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
                      className="opacity-0 group-hover:opacity-100 hover:text-red-500 p-1 rounded transition-opacity cursor-pointer shrink-0"
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
            className={`flex items-center w-full rounded-full transition-all cursor-pointer overflow-hidden whitespace-nowrap ${
              isOpen ? "px-3 py-2.5 gap-3 text-xs font-semibold" : "p-3.5 justify-center"
            } ${
              isDark
                ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900"
            }`}
            title={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
          >
            {isDark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            {isOpen && <span className="truncate">{isDark ? "Light mode" : "Dark mode"}</span>}
          </button>

          {/* Reset All App History Option */}
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to erase all your chat history and start clean?")) {
                onClearAll();
              }
            }}
            className={`flex items-center w-full rounded-full transition-all cursor-pointer overflow-hidden whitespace-nowrap ${
              isOpen ? "px-3 py-2.5 gap-3 text-xs font-semibold" : "p-3.5 justify-center"
            } ${
              isDark
                ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900"
            }`}
            title="Clear all chat databases"
          >
            <Settings className="w-4 h-4 shrink-0" />
            {isOpen && <span className="truncate">Erase history</span>}
          </button>

          {/* User Profile Card */}
          <div className="flex items-center justify-between gap-1 pt-1">
            <Link
              to="/profile"
              className={`flex-1 flex items-center rounded-2xl transition-all cursor-pointer overflow-hidden ${
                isOpen ? "px-3 py-2 gap-3 hover:bg-purple-500/10 group" : "py-2 justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
              title="View and edit profile"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    userInitial
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-[#1E1E1F]" />
              </div>
              {isOpen && (
                <div className="overflow-hidden text-left min-w-0 flex-1 whitespace-nowrap">
                  <p className={`text-xs font-semibold truncate ${isDark ? "text-white group-hover:text-purple-300" : "text-zinc-800 group-hover:text-purple-700"}`}>
                    {userName}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate font-mono">
                    {userEmail}
                  </p>
                </div>
              )}
            </Link>

            {isOpen && (
              <Link
                to="/signin"
                className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

