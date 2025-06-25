"use client";

import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    ImageIcon,
    FileUp,
    Figma,
    MonitorIcon,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
    SendIcon,
    XIcon,
    LoaderIcon,
    Sparkles,
    Command,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
    icon: React.ReactNode;
    label: string;
    description: string;
    prefix: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <div className={cn(
        "relative",
        containerClassName
      )}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {showRing && isFocused && (
          <motion.span 
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {props.onChange && (
          <div 
            className="absolute bottom-2 right-2 opacity-0 w-2 h-2 bg-violet-500 rounded-full"
            style={{
              animation: 'none',
            }}
            id="textarea-ripple"
          />
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export function AnimatedAIChat() {
    const [value, setValue] = useState("");
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [recentCommand, setRecentCommand] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 24,
        maxHeight: 200,
    });
    const [inputFocused, setInputFocused] = useState(false);
    const commandPaletteRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const commandSuggestions: CommandSuggestion[] = [
        { 
            icon: <ImageIcon className="w-4 h-4" />, 
            label: "Clone UI", 
            description: "Generate a UI from a screenshot", 
            prefix: "/clone" 
        },
        { 
            icon: <Figma className="w-4 h-4" />, 
            label: "Import Figma", 
            description: "Import a design from Figma", 
            prefix: "/figma" 
        },
        { 
            icon: <MonitorIcon className="w-4 h-4" />, 
            label: "Create Page", 
            description: "Generate a new web page", 
            prefix: "/page" 
        },
        { 
            icon: <Sparkles className="w-4 h-4" />, 
            label: "Improve", 
            description: "Improve existing UI design", 
            prefix: "/improve" 
        },
    ];

    useEffect(() => {
        if (value.startsWith('/') && !value.includes(' ')) {
            setShowCommandPalette(true);
            
            const matchingSuggestionIndex = commandSuggestions.findIndex(
                (cmd) => cmd.prefix.startsWith(value)
            );
            
            if (matchingSuggestionIndex >= 0) {
                setActiveSuggestion(matchingSuggestionIndex);
            } else {
                setActiveSuggestion(-1);
            }
        } else {
            setShowCommandPalette(false);
        }
    }, [value]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const commandButton = document.querySelector('[data-command-button]');
            
            if (commandPaletteRef.current && 
                !commandPaletteRef.current.contains(target) && 
                !commandButton?.contains(target)) {
                setShowCommandPalette(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (showCommandPalette) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev < commandSuggestions.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev > 0 ? prev - 1 : commandSuggestions.length - 1
                );
            } else if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestion >= 0) {
                    const selectedCommand = commandSuggestions[activeSuggestion];
                    setValue(selectedCommand.prefix + ' ');
                    setShowCommandPalette(false);
                    
                    setRecentCommand(selectedCommand.label);
                    setTimeout(() => setRecentCommand(null), 3500);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowCommandPalette(false);
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                handleSendMessage();
            }
        }
    };

    const handleSendMessage = async () => {
        if (value.trim()) {
            const userMessage = value.trim();
            setValue("");
            adjustHeight(true);
            
            // Add user message to chat
            const newMessages = [...messages, { role: "user", content: userMessage }];
            setMessages(newMessages);
            setIsTyping(true);

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
                setIsTyping(false);
            }
        }
    };

    const handleAttachFile = () => {
        const mockFileName = `file-${Math.floor(Math.random() * 1000)}.pdf`;
        setAttachments(prev => [...prev, mockFileName]);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };
    
    const selectCommandSuggestion = (index: number) => {
        const selectedCommand = commandSuggestions[index];
        setValue(selectedCommand.prefix + ' ');
        setShowCommandPalette(false);
        
        setRecentCommand(selectedCommand.label);
        setTimeout(() => setRecentCommand(null), 2000);
    };

    return (
        <div className="h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
                <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/5 dark:bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Messages Container */}
                <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto px-4 py-6 pb-48"
                >
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.length === 0 ? (
                            /* Welcome Message */
                            <motion.div 
                                className="text-center py-20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="inline-block"
                                >
                                    <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-2">
                                        How can I help today?
                                    </h1>
                                    <motion.div 
                                        className="h-px bg-gradient-to-r from-transparent via-border to-transparent"
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: "100%", opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                    />
                                </motion.div>
                                <motion.p 
                                    className="text-muted-foreground mt-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Type a command or ask a question
                                </motion.p>

                                {/* Suggestion Buttons */}
                                <motion.div 
                                    className="flex flex-wrap items-center justify-center gap-3 mt-8"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {commandSuggestions.map((suggestion, index) => (
                                        <motion.button
                                            key={suggestion.prefix}
                                            onClick={() => selectCommandSuggestion(index)}
                                            className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all border border-border/50 hover:border-border"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {suggestion.icon}
                                            <span>{suggestion.label}</span>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            </motion.div>
                        ) : (
                            /* Chat Messages */
                            <>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                            {message.role === "user" ? (
                                                <CircleUserRound className="w-4 h-4 text-muted-foreground" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center">
                                                    <Sparkles className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Message Content */}
                                        <div className={`flex-1 min-w-0 ${message.role === "user" ? "text-right" : ""}`}>
                                            <div className={`text-sm font-medium text-foreground mb-1 ${message.role === "user" ? "text-right" : ""}`}>
                                                {message.role === "user" ? "You" : "Assistant"}
                                            </div>
                                            <div className={`prose prose-sm max-w-none dark:prose-invert prose-pre:bg-muted prose-pre:border prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded ${message.role === "user" ? "text-right" : ""}`}>
                                                {message.role === "assistant" ? (
                                                    <div className="space-y-2">
                                                    <ReactMarkdown 
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                            h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                                                            h2: ({ children }) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
                                                            h3: ({ children }) => <h3 className="text-base font-medium mb-2">{children}</h3>,
                                                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                                            li: ({ children }) => <li className="mb-1">{children}</li>,
                                                            blockquote: ({ children }) => <blockquote className="border-l-4 border-muted pl-4 italic mb-2">{children}</blockquote>,
                                                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                                            em: ({ children }) => <em className="italic">{children}</em>,
                                                            pre: ({ children }) => <div className="bg-muted border rounded-lg p-4 overflow-x-auto mb-2">{children}</div>,
                                                            code: ({ node, inline, className, children, ...props }: any) => {
                                                                const match = /language-(\w+)/.exec(className || '');
                                                                return !inline ? (
                                                                    <code className={`block font-mono text-sm ${className}`} {...props}>
                                                                        {children}
                                                                    </code>
                                                                ) : (
                                                                    <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
                                                                        {children}
                                                                    </code>
                                                                );
                                                            },
                                                        }}
                                                    >
                                                        {message.content}
                                                    </ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <motion.div
                                        className="flex gap-4"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center">
                                            <Sparkles className="w-3 h-3 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-foreground mb-1">Assistant</div>
                                            <div className="flex items-center gap-2">
                                                <TypingDots />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="fixed bottom-0 left-0 right-0 p-4 pt-8 z-50 bg-gradient-to-t from-background via-background/90 to-transparent">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            {/* Command Palette */}
                            <AnimatePresence>
                                {showCommandPalette && (
                                    <motion.div 
                                        ref={commandPaletteRef}
                                        className="absolute bottom-full left-4 right-4 mb-2 backdrop-blur-xl bg-black/90 rounded-lg z-50 shadow-lg border border-white/10 overflow-hidden"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <div className="py-1 bg-black/95">
                                            {commandSuggestions.map((suggestion, index) => (
                                                <motion.div
                                                    key={suggestion.prefix}
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer",
                                                        activeSuggestion === index 
                                                            ? "bg-white/10 text-white" 
                                                            : "text-white/70 hover:bg-white/5"
                                                    )}
                                                    onClick={() => selectCommandSuggestion(index)}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: index * 0.03 }}
                                                >
                                                    <div className="w-5 h-5 flex items-center justify-center text-white/60">
                                                        {suggestion.icon}
                                                    </div>
                                                    <div className="font-medium">{suggestion.label}</div>
                                                    <div className="text-white/40 text-xs ml-1">
                                                        {suggestion.prefix}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Attachments */}
                            <AnimatePresence>
                                {attachments.length > 0 && (
                                    <motion.div 
                                        className="px-4 pb-3 flex gap-2 flex-wrap"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        {attachments.map((file, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex items-center gap-2 text-xs bg-white/[0.03] py-1.5 px-3 rounded-lg text-white/70"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                            >
                                                <span>{file}</span>
                                                <button 
                                                    onClick={() => removeAttachment(index)}
                                                    className="text-white/40 hover:text-white transition-colors"
                                                >
                                                    <XIcon className="w-3 h-3" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Input Box */}
                            <motion.div 
                                className="relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl"
                                initial={{ scale: 0.98 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="p-4">
                                    <Textarea
                                        ref={textareaRef}
                                        value={value}
                                        onChange={(e) => {
                                            setValue(e.target.value);
                                            adjustHeight();
                                        }}
                                        onKeyDown={handleKeyDown}
                                        onFocus={() => setInputFocused(true)}
                                        onBlur={() => setInputFocused(false)}
                                        placeholder="Ask zap a question..."
                                        containerClassName="w-full"
                                        className={cn(
                                            "w-full px-4 py-3",
                                            "resize-none",
                                            "bg-transparent",
                                            "border-none",
                                            "text-white/90 text-sm",
                                            "focus:outline-none",
                                            "placeholder:text-white/20",
                                            "min-h-[60px]"
                                        )}
                                        style={{
                                            overflow: "hidden",
                                        }}
                                        showRing={false}
                                    />
                                </div>

                                <div className="p-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <motion.button
                                            type="button"
                                            onClick={handleAttachFile}
                                            whileTap={{ scale: 0.94 }}
                                            className="p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group"
                                        >
                                            <Paperclip className="w-4 h-4" />
                                            <motion.span
                                                className="absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                layoutId="button-highlight"
                                            />
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            data-command-button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowCommandPalette(prev => !prev);
                                            }}
                                            whileTap={{ scale: 0.94 }}
                                            className={cn(
                                                "p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group",
                                                showCommandPalette && "bg-white/10 text-white/90"
                                            )}
                                        >
                                            <Command className="w-4 h-4" />
                                            <motion.span
                                                className="absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                layoutId="button-highlight"
                                            />
                                        </motion.button>
                                    </div>
                                    
                                    <motion.button
                                        type="button"
                                        onClick={handleSendMessage}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isTyping || !value.trim()}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                            "flex items-center gap-2",
                                            value.trim()
                                                ? "bg-white text-[#0A0A0B] shadow-lg shadow-white/10"
                                                : "bg-white/[0.05] text-white/40"
                                        )}
                                    >
                                        {isTyping ? (
                                            <LoaderIcon className="w-4 h-4 animate-[spin_2s_linear_infinite]" />
                                        ) : (
                                            <SendIcon className="w-4 h-4" />
                                        )}
                                        <span>Send</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TypingDots() {
    return (
        <div className="flex items-center space-x-1">
            <div className="text-muted-foreground">Thinking</div>
            <div className="flex space-x-1">
                {[1, 2, 3].map((dot) => (
                    <motion.div
                        key={dot}
                        className="w-1 h-1 bg-muted-foreground rounded-full"
                        initial={{ opacity: 0.3 }}
                        animate={{ 
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: dot * 0.2,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}


