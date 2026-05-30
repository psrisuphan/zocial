"use client";

import {
  createContext, useCallback, useContext,
  useEffect, useRef, useState,
} from "react";
import { clsx } from "clsx";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  success: () => {},
  error: () => {},
  info: () => {},
});

const icons: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "i",
};

const styles: Record<ToastType, string> = {
  success: "bg-bg-surface border-accent text-text-primary",
  error:   "bg-bg-surface border-status-error text-text-primary",
  info:    "bg-bg-surface border-border text-text-primary",
};

const iconStyles: Record<ToastType, string> = {
  success: "text-accent",
  error:   "text-status-error",
  info:    "text-text-muted",
};

function ToastItem({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(item.id), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [item.id, onRemove]);

  return (
    <div
      className={clsx(
        "flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg text-sm min-w-[260px] max-w-[360px] transition-all duration-300",
        styles[item.type],
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )}
    >
      <span className={clsx("font-bold text-xs mt-0.5 flex-shrink-0", iconStyles[item.type])}>
        {icons[item.type]}
      </span>
      <p className="flex-1 text-text-secondary">{item.message}</p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onRemove(item.id), 300);
        }}
        className="text-text-muted hover:text-text-primary flex-shrink-0 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${++counterRef.current}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const ctx: ToastContextType = {
    success: (msg) => addToast("success", msg),
    error:   (msg) => addToast("error", msg),
    info:    (msg) => addToast("info", msg),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem item={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
