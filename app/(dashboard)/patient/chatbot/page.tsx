"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import * as api from "@/lib/client/api";
import { getErrorMessage } from "@/lib/utils";

/* ── Types ── */
type Role = "user" | "bot";

interface Message {
  id: number;
  role: Role;
  text: string;
}

/* A single turn sent to the API for conversation history */
interface HistoryTurn {
  role: "user" | "model";
  text: string;
}

/* ── Inline SVG icons ── */
function IcoBot() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15m-6.75-3.375h.008v.008H13.05V11.625zm0 0H11.625M19.8 15l-1.8 1.5M19.8 15V21M5 14.5l-1.8 1.5m0 0V21M3.2 16l1.8 1.5M19.8 21H4.2" />
    </svg>
  );
}

function IcoSend() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function IcoUser() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function IcoRefresh() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

/* ── Typing indicator ── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-aq-darker/60 inline-block"
          style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  );
}

/* ── Suggested prompts ── */
const SUGGESTIONS = [
  "What are common symptoms of high blood pressure?",
  "How much water should I drink daily?",
  "What foods help boost immunity?",
  "How can I improve my sleep quality?",
  "What is the difference between a cold and the flu?",
  "How do I manage stress and anxiety naturally?",
];

let messageCounter = 0;
function nextId() {
  return ++messageCounter;
}

const INITIAL_BOT_MESSAGE: Message = {
  id: nextId(),
  role: "bot",
  text: "Hello! I'm MediCare Pro's AI Health Assistant. I can help you with general health questions, wellness tips, and understanding medical information.\n\nPlease note: I'm not a substitute for professional medical advice. Always consult your doctor for diagnosis or treatment.\n\nHow can I help you today?",
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatMutation = useMutation({
    mutationFn: ({ text, history }: { text: string; history: HistoryTurn[] }) =>
      api.sendChatMessage(text, history),
    onSuccess: (reply) => {
      setMessages((prev) => [...prev, { id: nextId(), role: "bot", text: reply }]);
      inputRef.current?.focus();
    },
    onError: (err) => {
      const msg = getErrorMessage(err, "Sorry, something went wrong.");
      setMessages((prev) => [...prev, { id: nextId(), role: "bot", text: msg }]);
      inputRef.current?.focus();
    },
  });

  /* Auto-scroll to bottom whenever messages change */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatMutation.isPending]);

  /* Build history array for API (excludes the initial bot greeting) */
  function buildHistory(msgs: Message[]): HistoryTurn[] {
    return msgs
      .slice(1) // skip initial greeting
      .map((m) => ({ role: m.role === "user" ? "user" : "model", text: m.text }));
  }

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || chatMutation.isPending) return;

    const userMsg: Message = { id: nextId(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    chatMutation.mutate({ text: trimmed, history: buildHistory([...messages, userMsg]) });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  /* Allow Shift+Enter for new line, Enter alone to send */
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleClear() {
    messageCounter = 0;
    setMessages([{ ...INITIAL_BOT_MESSAGE, id: nextId() }]);
    setInput("");
  }

  /* Render a single message bubble */
  function renderBubble(msg: Message) {
    const isUser = msg.role === "user";
    return (
      <div key={msg.id} className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-sidebar text-aq" : "bg-aq text-sidebar"
          }`}
        >
          {isUser ? <IcoUser /> : <IcoBot />}
        </div>

        {/* Bubble */}
        <div
          className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
            isUser
              ? "bg-sidebar text-white rounded-br-sm"
              : "bg-white border border-gray-100 text-ink rounded-bl-sm"
          }`}
        >
          {msg.text}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* ── Page header ── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-aq-faint flex items-center justify-center text-aq-darker">
            <IcoBot />
          </div>
          <div>
            <h1 className="text-base font-semibold text-ink">AI Health Assistant</h1>
            <p className="text-xs text-gray-400">Powered by Llama 3.3 70B · For general wellness advice only · For general wellness advice only</p>
          </div>
        </div>

        {/* Clear chat button */}
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-ink border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 transition-colors"
        >
          <IcoRefresh />
          New chat
        </button>
      </div>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4 bg-gray-50/60">
        {messages.map(renderBubble)}

        {/* Typing indicator */}
        {chatMutation.isPending && (
          <div className="flex items-end gap-2.5">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-aq flex items-center justify-center text-sidebar">
              <IcoBot />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Suggestions (shown only when only the greeting exists) ── */}
      {messages.length === 1 && !chatMutation.isPending && (
        <div className="flex-shrink-0 px-4 sm:px-8 pb-2 pt-1">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Try asking…</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs bg-white border border-gray-200 hover:border-aq hover:bg-aq-faint text-gray-600 hover:text-aq-darker rounded-full px-3 py-1.5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input area ── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 sm:px-8 py-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a health question… (Enter to send, Shift+Enter for new line)"
            rows={1}
            disabled={chatMutation.isPending}
            className="flex-1 resize-none rounded-xl border border-gray-200 focus:border-aq/50 focus:ring-2 focus:ring-aq/20 outline-none px-4 py-3 text-sm text-ink placeholder-gray-400 disabled:opacity-60 transition-colors"
            style={{ maxHeight: "120px", overflowY: "auto" }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = Math.min(t.scrollHeight, 120) + "px";
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || chatMutation.isPending}
            className="flex-shrink-0 w-11 h-11 rounded-xl bg-aq hover:bg-aq-dark disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-sidebar transition-colors shadow-sm"
          >
            <IcoSend />
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-400 mt-2">
          AI responses are for general information only. Not a substitute for professional medical advice.
        </p>
      </div>

      {/* Bounce keyframe (inline for the typing dots) */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
