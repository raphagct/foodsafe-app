import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import ToastStack, { type ToastItem, type ToastType } from "../components/ToastStack";

interface ShowToastOptions {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (options: ShowToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 3200,
  error: 4500,
  warning: 4000,
  info: 3500,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ type = "info", title, message, duration }: ShowToastOptions) => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, type, title, message, duration: duration ?? DEFAULT_DURATION[type] }]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
