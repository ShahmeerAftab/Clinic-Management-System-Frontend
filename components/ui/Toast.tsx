"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

/* ── Types ── */
type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  leaving?: boolean;
}

interface ToastContextValue {
  success: (msg: string) => void;
  error:   (msg: string) => void;
  info:    (msg: string) => void;
  warning: (msg: string) => void;
}

/* ── Context ── */
const ToastContext = createContext<ToastContextValue>({
  success: () => {},
  error:   () => {},
  info:    () => {},
  warning: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

/* ── Config ── */
const toastConfig: Record<ToastType, { icon: ReactNode; border: string; bg: string }> = {
  success: {
    border: "border-emerald-200",
    bg:     "bg-emerald-50",
    icon: (
      <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  error: {
    border: "border-rose-200",
    bg:     "bg-rose-50",
    icon: (
      <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    border: "border-amber-200",
    bg:     "bg-amber-50",
    icon: (
      <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  info: {
    border: "border-aq/30",
    bg:     "bg-aq-faint",
    icon: (
      <svg className="w-5 h-5 text-aq-darker shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

/* ── Provider ── */
let _nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    );
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
  }, []);

  const push = useCallback(
    (type: ToastType, message: string) => {
      const id = _nextId++;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );

  const ctx: ToastContextValue = {
    success: (msg) => push("success", msg),
    error:   (msg) => push("error",   msg),
    info:    (msg) => push("info",    msg),
    warning: (msg) => push("warning", msg),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}

      {/* Portal */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 pointer-events-none"
      >
        {toasts.map((t) => {
          const cfg = toastConfig[t.type];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-lg shadow-black/5 min-w-[300px] max-w-sm ${cfg.bg} ${cfg.border} ${t.leaving ? "toast-leave" : "toast-enter"}`}
            >
              {cfg.icon}
              <p className="flex-1 text-sm font-medium text-gray-800 leading-snug">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 mt-0.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
