"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function Confetti() {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; color: string; size: number }[]>([]);

  useEffect(() => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
    const ps = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 6,
    }));
    setParticles(ps);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}

function SuccessContent() {
  const [showConfetti, setShowConfetti] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    // Komoju session verify
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      fetch(`/api/komoju/verify?session_id=${sessionId}`).catch(() => {});
    }
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="max-w-lg w-full mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4"><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
          <h1 className="text-3xl font-black text-blue-800 mb-2">プレミアム会員へようこそ！</h1>
          <p className="text-gray-500">クレームAIのフル機能が解放されました</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-blue-800 mb-3 text-sm">あなたの特典</h2>
          <ul className="space-y-2 text-sm text-blue-900">
            <li className="flex items-start gap-2"><svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>クレーム対応文・電話スクリプト・チェックリストが無制限生成</li>
            <li className="flex items-start gap-2"><svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>悪質クレーマー・カスハラ対応モード（毅然とした断り文）</li>
            <li className="flex items-start gap-2"><svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>クレームレベル自動判定（🔴重大 / 🟡中程度 / 🟢軽微）</li>
            <li className="flex items-start gap-2"><svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>対応履歴10件を自動保存（直近の案件をすぐ参照）</li>
            <li className="flex items-start gap-2"><svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Google口コミ返信文も生成対応</li>
          </ul>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="font-bold text-gray-800 text-center text-sm">まずはこの3ステップ</h2>

          <Link href="/tool" className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-blue-600">1</div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">今抱えているクレームを入力する</p>
              <p className="text-xs text-gray-400">業種・状況を選ぶだけで対応文が完成</p>
            </div>
            <span className="text-gray-300 group-hover:text-blue-600 transition-colors">→</span>
          </Link>

          <Link href="/tool" className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-blue-600">2</div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">深刻度「重大」で悪質クレーム対応を確認</p>
              <p className="text-xs text-gray-400">法的リスクを考慮した毅然とした返答文</p>
            </div>
            <span className="text-gray-300 group-hover:text-blue-600 transition-colors">→</span>
          </Link>

          <Link href="/guide/kasuhara" className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-blue-600">3</div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">カスハラ義務化ガイドを読む（2026年10月）</p>
              <p className="text-xs text-gray-400">全事業主必須の対応チェックリスト付き</p>
            </div>
            <span className="text-gray-300 group-hover:text-blue-600 transition-colors">→</span>
          </Link>
        </div>

        <div className="text-center bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
          <p className="text-xs text-gray-500 mb-1">クレームが発生したらすぐアクセス</p>
          <p className="text-sm font-bold text-gray-700">このサイトをブックマークしておきましょう</p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 mb-1">ご感想をお聞かせください（30秒）</p>
          <a href="mailto:support@pokkorilab.com?subject=クレームAIへのご感想&body=ご感想をお書きください" className="text-xs text-blue-500 underline hover:text-blue-700">感想を送る →</a>
        </div>
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center py-12">
      <Suspense fallback={<div className="text-center text-gray-500">読み込み中...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
