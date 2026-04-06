"use client";
import { useState, useEffect } from "react";

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => Promise<void> } | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as Event & { prompt: () => Promise<void> });
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-3 rounded-xl flex items-center justify-between z-50 shadow-lg">
      <span className="text-sm font-medium flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="1" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="12.5" r="0.75" fill="currentColor"/></svg>ホーム画面に追加して素早くアクセス</span>
      <button
        onClick={async () => {
          await deferredPrompt?.prompt();
          setShowBanner(false);
        }}
        className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-bold ml-2"
      >
        追加
      </button>
    </div>
  );
}
