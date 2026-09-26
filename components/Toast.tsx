"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, RotateCcw, X } from "lucide-react";

export interface ToastData {
  id: string;
  message: string;
  canUndo?: boolean;
  onUndo?: () => void;
}

interface ToastProps {
  toast: ToastData | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;

    setProgress(100);
    const duration = 6000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700/80 p-3.5 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold truncate">
              {toast.message}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {toast.canUndo && toast.onUndo && (
              <button
                type="button"
                onClick={() => {
                  toast.onUndo?.();
                  onClose();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ย้อนกลับ</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="ปิดการแจ้งเตือน"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
          <div
            className="bg-emerald-400 h-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
