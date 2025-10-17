import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // ms
}

interface ToastContextType {
  toasts: ToastItem[];
  show: (message: string, type?: ToastType, opts?: { duration?: number }) => void;
  success: (message: string, opts?: { duration?: number }) => void;
  info: (message: string, opts?: { duration?: number }) => void;
  warning: (message: string, opts?: { duration?: number }) => void;
  error: (message: string, opts?: { duration?: number }) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((message: string, type: ToastType = 'info', opts?: { duration?: number }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const duration = opts?.duration ?? 3000;
    const toast: ToastItem = { id, message, type, duration };
    setToasts(prev => [...prev, toast]);

    if (duration && duration > 0) {
      window.setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);

  const api = useMemo(() => ({
    toasts,
    show,
    success: (m: string, o?: { duration?: number }) => show(m, 'success', o),
    info: (m: string, o?: { duration?: number }) => show(m, 'info', o),
    warning: (m: string, o?: { duration?: number }) => show(m, 'warning', o),
    error: (m: string, o?: { duration?: number }) => show(m, 'error', o),
    dismiss,
  }), [toasts, show, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
