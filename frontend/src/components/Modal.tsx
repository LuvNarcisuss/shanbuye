import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

export default function Modal({ open, title, description, onClose, children, width = 'max-w-lg' }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`w-full ${width} max-h-[88vh] overflow-y-auto rounded-2xl bg-white shadow-2xl`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div><h2 className="text-lg font-bold text-slate-900">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="关闭"><X className="h-5 w-5" /></button>
        </header>
        <div className="p-6">{children}</div>
      </section>
    </div>
  );
}
