import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type ToastKind = 'success' | 'error' | 'info';
type ToastDetail = { message: string; kind?: ToastKind };

export function notify(message: string, kind: ToastKind = 'success') {
  window.dispatchEvent(new CustomEvent<ToastDetail>('app-toast', { detail: { message, kind } }));
}

export default function ToastHost() {
  const [toast, setToast] = useState<(ToastDetail & { id: number }) | null>(null);

  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<ToastDetail>).detail;
      setToast({ ...detail, id: Date.now() });
    };
    window.addEventListener('app-toast', onToast);
    return () => window.removeEventListener('app-toast', onToast);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const Icon = toast?.kind === 'error' ? AlertCircle : toast?.kind === 'info' ? Info : CheckCircle2;
  const color = toast?.kind === 'error' ? 'text-red-600 bg-red-50' : toast?.kind === 'info' ? 'text-blue-600 bg-blue-50' : 'text-emerald-600 bg-emerald-50';

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="fixed right-6 top-20 z-[70] flex max-w-sm items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-slate-200"
        >
          <span className={`rounded-lg p-2 ${color}`}><Icon className="h-4 w-4" /></span>
          <p className="flex-1 text-sm font-medium text-slate-700">{toast.message}</p>
          <button onClick={() => setToast(null)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="关闭提示"><X className="h-4 w-4" /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
