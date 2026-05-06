import React, { useEffect } from 'react';

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-ink-800 border border-ink-600 rounded-2xl w-full max-w-md shadow-2xl animate-fade-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-ink-700">
          <h3 className="font-display font-bold text-ink-50 text-lg">{title}</h3>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-200 transition-colors text-xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
