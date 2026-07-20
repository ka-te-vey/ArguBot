import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, RefreshCw, PanelLeft } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import InputArea from "./components/InputArea";
import Dashboard from "./pages/Dashboard";
import ChatBot from "./pages/ChatBot";
import ReviewAndVerdict from "./pages/ReviewAndVerdict";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyCode from "./pages/VerifyCode";
import { useTheme } from "./components/Theme";

export default function App() {
  const { theme } = useTheme();

  // Sidebar collapsible state
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Default open on desktop, closed on mobile
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // Recent chats stored in LocalStorage
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("argubot_chats");
    return saved ? JSON.parse(saved) : [];
  });

  // Active chat session ID
  const [activeChatId, setActiveChatId] = useState(null);

  // Core interactive states
  const [inputText, setInputText] = useState("");
  const [rounds, setRounds] = useState(3);
  const [isThinking, setIsThinking] = useState(false);
  const [isCalculatingScore, setIsCalculatingScore] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);



  // Sync chats to LocalStorage
  useEffect(() => {
    localStorage.setItem("argubot_chats", JSON.stringify(chats));
  }, [chats]);

  // Find the active chat details
  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Helper to update fields of the active chat
  const updateActiveChat = (fields) => {
    if (!activeChatId) return;
    setChats((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, ...fields } : c))
    );
  };



  // Erase all chat databases
  const handleClearAllHistory = () => {
    setChats([]);
    setActiveChatId(null);
    setInputText("");
    setErrorBanner(null);
  };

  // Trigger New Chat Landing state
  const handleNewChat = () => {
    setActiveChatId(null);
    setInputText("");
    setErrorBanner(null);
  };

  // Select a recent chat
  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setInputText("");
    setErrorBanner(null);
  };

  // Delete a chat from recent history
  const handleDeleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
      setInputText("");
    }
  };

  // Launch the debate with user's opinion
  const handleStartDebate = async (opinionVal) => {
    setErrorBanner(null);
    const chatId = Date.now().toString();

    const firstMsg = {
      role: "user",
      text: opinionVal,
      timestamp: Date.now()
    };

    const newChat = {
      id: chatId,
      opinion: opinionVal,
      totalRounds: rounds,
      history: [firstMsg],
      score: null,
      screen: "debate",
      timestamp: Date.now()
    };

    // Prepend new chat to recent lists
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(chatId);
    setInputText("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opinion: opinionVal, history: [firstMsg] })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initialize debate.");
      }

      const data = await response.json();
      const aiReply = {
        role: "ai",
        text: data.reply,
        timestamp: Date.now()
      };

      // Since state update with chats is asynchronous, we find and update immediately
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, history: [...c.history, aiReply] } : c
        )
      );
    } catch (err) {
      console.error("Debate initialization error:", err);
      setErrorBanner(err.message || "Could not connect to debate servers. Click retry below.");
    } finally {
      setIsThinking(false);
    }
  };

  // Send counter-argument
  const handleSendMessage = async () => {
    if (!activeChat || isThinking || !inputText.trim()) return;
    setErrorBanner(null);

    const userMsgVal = inputText.trim();
    setInputText("");

    const newUserMsg = {
      role: "user",
      text: userMsgVal,
      timestamp: Date.now()
    };

    const updatedHistory = [...activeChat.history, newUserMsg];
    updateActiveChat({ history: updatedHistory });
    setIsThinking(true);

    try {
      const response = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opinion: activeChat.opinion, history: updatedHistory })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Opponent declined to defend. Retry sending.");
      }

      const data = await response.json();
      const aiMsg = {
        role: "ai",
        text: data.reply,
        timestamp: Date.now()
      };

      updateActiveChat({ history: [...updatedHistory, aiMsg] });
    } catch (err) {
      console.error("SendMessage counter error:", err);
      setErrorBanner(err.message || "Failed to deliver counterpoint. Verify connection.");
    } finally {
      setIsThinking(false);
    }
  };

  // Analyze performance & fetch rating
  const handleTriggerScoring = async () => {
    if (!activeChat) return;
    updateActiveChat({ screen: "score" });
    setIsCalculatingScore(true);
    setErrorBanner(null);

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opinion: activeChat.opinion, history: activeChat.history })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "The judge refused evaluation.");
      }

      const data = await response.json();
      updateActiveChat({ score: data });
    } catch (err) {
      console.error("Evaluation error:", err);
      setErrorBanner(err.message || "Failed to retrieve judging score sheet.");
      updateActiveChat({ score: null });
    } finally {
      setIsCalculatingScore(false);
    }
  };

  // Continue debating after scoring (for Blitz round matches)
  const handleDebateBack = () => {
    if (!activeChat) return;
    updateActiveChat({
      totalRounds: activeChat.totalRounds + 3,
      screen: "debate",
      score: null
    });
  };

  // Retry starting/refetching on failure
  const handleRetryClash = () => {
    if (activeChat) {
      handleSendMessage();
    } else {
      handleStartDebate(inputText);
    }
  };

  // Determine bottom input bar properties
  const isDebateOngoing = activeChat !== null && activeChat.screen === "debate";
  const userMessages = activeChat ? activeChat.history.filter((m) => m.role === "user") : [];
  const totalLimit = activeChat ? activeChat.totalRounds : rounds;
  const isLastRoundAndWaiting = activeChat !== null && userMessages.length >= totalLimit && activeChat.history[activeChat.history.length - 1]?.role === "user";
  const isDebateFullyComplete = activeChat !== null && userMessages.length >= totalLimit && activeChat.history[activeChat.history.length - 1]?.role === "ai";

  const showInputArea = !activeChat || (activeChat.screen === "debate" && !isDebateFullyComplete);

  const getPlaceholderText = () => {
    if (isThinking) return "ArguBot is formulating ruthlessly...";
    if (!activeChat) return "Enter an opinion you're ready to defend...";
    if (isLastRoundAndWaiting) return "ArguBot is delivering the final blow...";
    const count = userMessages.length + 1;
    return `Counter-argument (Round ${count} of ${totalLimit})...`;
  };

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route
        path="/*"
        element={
          <div className={`flex h-screen w-screen overflow-hidden font-sans select-none transition-colors duration-300 ${
            theme === "dark" ? "bg-[#131314] text-[#E3E3E3]" : "bg-white text-[#1F1F1F]"
          }`}>
            {/* Collapsible Left Sidebar */}
            <Sidebar
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onDeleteChat={handleDeleteChat}
              onClearAll={handleClearAllHistory}
            />

            {/* Main Container */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              {/* Global Error Banner */}
              {errorBanner && (
                <div className="bg-red-900/90 border-b border-red-700/50 text-red-100 px-4 py-2.5 text-xs font-mono text-center flex items-center justify-center gap-2.5 z-50 sticky top-0 backdrop-blur-md">
                  <ShieldAlert className="w-4 h-4 text-red-200 shrink-0" />
                  <span>{errorBanner}</span>
                  <button
                    onClick={() => setErrorBanner(null)}
                    className="ml-4 underline hover:text-white cursor-pointer text-zinc-300"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={handleRetryClash}
                    className="ml-2 px-2 py-0.5 bg-red-800 rounded border border-red-600 hover:bg-red-700 text-[10px] inline-flex items-center gap-1 cursor-pointer text-white"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry Arena
                  </button>
                </div>
              )}

              {/* Top Header Bar */}
              <header className={`h-14 flex items-center justify-between px-4 md:px-6 shrink-0 z-30 transition-colors duration-300 ${
                theme === "dark" ? "bg-[#131314] border-b border-zinc-800" : "bg-white border-b border-zinc-100"
              }`}>
                <div className="flex items-center gap-3">
                  {/* Sidebar toggle for mobile or when sidebar is collapsed */}
                  {!isSidebarOpen && (
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="p-2 rounded-lg hover:bg-zinc-200/55 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-500"
                      title="Open navigation menu"
                    >
                      <PanelLeft className="w-4.5 h-4.5" />
                    </button>
                  )}

                  <button
                    onClick={handleNewChat}
                    className="flex items-center gap-2.5 focus:outline-none text-left"
                  >
                    <h1 className={`text-xl font-bold tracking-tight uppercase ${
                      theme === "dark" ? "text-white" : "text-zinc-900"
                    }`}>
                      ArguBot
                    </h1>
                  </button>
                </div>

                {/* Quick round indicator / active state display in header */}
                {activeChat && activeChat.screen === "debate" && (
                  <div className="flex items-center gap-3 select-none">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                      Exchanges: {userMessages.length} / {activeChat.totalRounds}
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: activeChat.totalRounds }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                            idx < userMessages.length
                              ? "bg-purple-500"
                              : "bg-zinc-300 dark:bg-zinc-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </header>

              {/* Dynamic Inner Panel Viewport */}
              <main className="flex-1 flex flex-col overflow-hidden relative w-full">
                <AnimatePresence mode="wait">
                  {!activeChat ? (
                    // 1. Landing Setup Screen
                    <motion.div
                      key="landing"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="flex-1 flex flex-col justify-between overflow-y-auto w-full"
                    >
                      <Dashboard
                        onSelectPrompt={(pText) => setInputText(pText)}
                        rounds={rounds}
                        onSetRounds={setRounds}
                      />
                    </motion.div>
                  ) : activeChat.screen === "debate" ? (
                    // 2. Conversation Feed Screen
                    <motion.div
                      key="debate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col overflow-hidden w-full"
                    >
                      <ChatBot
                        activeChat={activeChat}
                        isThinking={isThinking}
                        handleTriggerScoring={handleTriggerScoring}
                      />
                    </motion.div>
                  ) : (
                    // 3. Verdict Scoring Screen
                    <motion.div
                      key="score"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col overflow-y-auto w-full justify-start py-8"
                    >
                      <ReviewAndVerdict
                        activeChat={activeChat}
                        isCalculatingScore={isCalculatingScore}
                        handleNewChat={handleNewChat}
                        handleDebateBack={handleDebateBack}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>

              {/* Shared Bottom Sticky Pill Input Container */}
              {showInputArea && (
                <InputArea
                  value={inputText}
                  onChange={setInputText}
                  onSubmit={() => {
                    if (activeChat) {
                      handleSendMessage();
                    } else {
                      handleStartDebate(inputText);
                    }
                  }}
                  isThinking={isThinking}
                  placeholder={getPlaceholderText()}
                  disabled={isLastRoundAndWaiting || isThinking}
                />
              )}
            </div>
          </div>
        }
      />
    </Routes>
  );
}

