"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Mic,
  ArrowUp,
  Plus,
  FileText,
  Code,
  BookOpen,
  PenTool,
  BrainCircuit,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AIAssistantInterface() {
  const [inputValue, setInputValue] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [deepResearchEnabled, setDeepResearchEnabled] = useState(false);
  const [reasonEnabled, setReasonEnabled] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showUploadAnimation, setShowUploadAnimation] = useState(false);
  const [activeCommandCategory, setActiveCommandCategory] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const commandSuggestions = {
    learn: [
      "Explain the Big Bang theory",
      "How does photosynthesis work?",
      "What are black holes?",
      "Explain quantum computing",
      "How does the human brain work?",
    ],
    code: [
      "Create a React component for a todo list",
      "Write a Python function to sort a list",
      "How to implement authentication in Next.js",
      "Explain async/await in JavaScript",
      "Create a CSS animation for a button",
    ],
    write: [
      "Write a professional email to a client",
      "Create a product description for a smartphone",
      "Draft a blog post about AI",
      "Write a creative story about space exploration",
      "Create a social media post about sustainability",
    ],
  };

  const handleUploadFile = () => {
    setShowUploadAnimation(true);

    // Simulate file upload with timeout
    setTimeout(() => {
      const newFile = `Document.pdf`;
      setUploadedFiles((prev) => [...prev, newFile]);
      setShowUploadAnimation(false);
    }, 1500);
  };

  const handleCommandSelect = (command: string) => {
    setInputValue(command);
    setActiveCommandCategory(null);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = inputValue.trim();
      setInputValue("");
      
      // Add user message to chat
      const newMessages = [...messages, { role: "user", content: userMessage }];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        // Send to API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: newMessages }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.message) {
          setMessages([...newMessages, data.message]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "I apologize, but I encountered an error. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-zinc-900 p-6">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 w-20 h-20 relative">
          <img
            src="https://i.postimg.cc/xTGKScrL/emojis-com-roblox.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Welcome message */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 mb-2">
              هداج
            </h1>
            <p className="text-gray-500 max-w-md">
              اسألني أي شيء أو جرب أحد الاقتراحات اللي تحت
            </p>
          </motion.div>
        </div>

        {/* Messages Display */}
        {messages.length > 0 && (
          <div className="w-full max-h-96 overflow-y-auto mb-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-gray-100 dark:bg-zinc-700">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input area with integrated functions and file upload */}
        <div className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm overflow-hidden mb-4">
          <div className="p-4">
            <input
              ref={inputRef}
              type="text"
              placeholder={messages.length === 0 ? "Ask me anything..." : "Type your message..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="w-full text-gray-700 text-base outline-none placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>

          {/* Uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className="px-4 pb-3">
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-700 py-1 px-2 rounded-md border border-gray-200 dark:border-zinc-600"
                  >
                    <FileText className="w-3 h-3 text-blue-600" />
                    <span className="text-xs text-gray-700">{file}</span>
                    <button
                      onClick={() =>
                        setUploadedFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search, Deep Research, Reason functions and actions */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchEnabled(!searchEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  searchEnabled
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
              <button
                onClick={() => setDeepResearchEnabled(!deepResearchEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  deepResearchEnabled
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={
                    deepResearchEnabled ? "text-blue-600" : "text-gray-400"
                  }
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="8" cy="8" r="3" fill="currentColor" />
                </svg>
                <span>Deep Research</span>
              </button>
              <button
                onClick={() => setReasonEnabled(!reasonEnabled)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  reasonEnabled
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                <BrainCircuit
                  className={`w-4 h-4 ${
                    reasonEnabled ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <span>Reason</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  inputValue.trim() && !isLoading
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Upload files */}
          <div className="px-4 py-2 border-t border-gray-100">
            <button
              onClick={handleUploadFile}
              className="flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900 transition-colors"
            >
              {showUploadAnimation ? (
                <motion.div
                  className="flex space-x-1"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                      variants={{
                        hidden: { opacity: 0, y: 5 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.4,
                            repeat: Infinity,
                            repeatType: "mirror",
                            delay: i * 0.1,
                          },
                        },
                      }}
                    />
                  ))}
                </motion.div>
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>Upload Files</span>
            </button>
          </div>
        </div>

        {/* Command categories */}
        <div className="w-full grid grid-cols-3 gap-4 mb-4">
          <CommandButton
            icon={<BookOpen className="w-5 h-5" />}
            label="Learn"
            isActive={activeCommandCategory === "learn"}
            onClick={() =>
              setActiveCommandCategory(
                activeCommandCategory === "learn" ? null : "learn"
              )
            }
          />
          <CommandButton
            icon={<Code className="w-5 h-5" />}
            label="Code"
            isActive={activeCommandCategory === "code"}
            onClick={() =>
              setActiveCommandCategory(
                activeCommandCategory === "code" ? null : "code"
              )
            }
          />
          <CommandButton
            icon={<PenTool className="w-5 h-5" />}
            label="Write"
            isActive={activeCommandCategory === "write"}
            onClick={() =>
              setActiveCommandCategory(
                activeCommandCategory === "write" ? null : "write"
              )
            }
          />
        </div>

        {/* Command suggestions */}
        <AnimatePresence>
          {activeCommandCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mb-6 overflow-hidden"
            >
              <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700">
                    {activeCommandCategory === "learn"
                      ? "Learning suggestions"
                      : activeCommandCategory === "code"
                      ? "Coding suggestions"
                      : "Writing suggestions"}
                  </h3>
                </div>
                <ul className="divide-y divide-gray-100">
                  {commandSuggestions[
                    activeCommandCategory as keyof typeof commandSuggestions
                  ].map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleCommandSelect(suggestion)}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors duration-75"
                    >
                      <div className="flex items-center gap-3">
                        {activeCommandCategory === "learn" ? (
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        ) : activeCommandCategory === "code" ? (
                          <Code className="w-4 h-4 text-blue-600" />
                        ) : (
                          <PenTool className="w-4 h-4 text-blue-600" />
                        )}
                        <span className="text-sm text-gray-700">
                          {suggestion}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface CommandButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function CommandButton({ icon, label, isActive, onClick }: CommandButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
        isActive
          ? "bg-blue-50 border-blue-200 shadow-sm"
          : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
      }`}
    >
      <div className={`${isActive ? "text-blue-600" : "text-gray-500"}`}>
        {icon}
      </div>
      <span
        className={`text-sm font-medium ${
          isActive ? "text-blue-700" : "text-gray-700"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}
