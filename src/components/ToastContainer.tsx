import React from 'react';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const typeStyles: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-800 dark:text-emerald-200',
    icon: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
  },
  info: {
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    border: 'border-sky-200 dark:border-sky-800',
    text: 'text-sky-800 dark:text-sky-200',
    icon: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400" />
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-100',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
  },
  error: {
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-900 dark:text-rose-100',
    icon: <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
  },
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map(t => {
        const style = typeStyles[t.type] || typeStyles.info;
        return (
          <div
            key={t.id}
            className={`w-[320px] shadow-lg rounded-lg border ${style.border} ${style.bg} overflow-hidden animate-slide-in`}
            role="status"
            aria-live="polite"
          >
            <div className="p-3 flex items-start gap-3">
              <div className="mt-0.5">{style.icon}</div>
              <div className={`text-sm ${style.text}`}>{t.message}</div>
              <button
                onClick={() => dismiss(t.id)}
                className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}

      {/* simple keyframe for enter animation */}
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(-6px) translateX(6px);} to { opacity: 1; transform: translateY(0) translateX(0);} }
        .animate-slide-in { animation: slideIn .18s ease-out; }
      `}</style>
    </div>
  );
};

export default ToastContainer;
