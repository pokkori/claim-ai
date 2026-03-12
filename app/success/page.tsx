"use client";

import { Suspense } from "react";
import Link from "next/link";

function SuccessContent() {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">ご契約ありがとうございます！</h1>
      <p className="text-gray-500 mb-6">プレミアムプランが有効になりました。</p>
      <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700">
        ツールを使う →
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <Suspense fallback={<div className="text-center text-gray-500">読み込み中...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
