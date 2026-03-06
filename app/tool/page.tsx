"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const FREE_LIMIT = 3;
const KEY = "claim_count";

function Paywall({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
        <div className="text-3xl mb-3">💼</div>
        <h2 className="text-lg font-bold mb-2">無料枠を使い切りました</h2>
        <p className="text-sm text-gray-500 mb-5">引き続きご利用いただくには有料プランをご選択ください</p>
        <div className="space-y-3 mb-4">
          <a href="https://gumroad.com/l/REPLACE" target="_blank" rel="noopener noreferrer" className="block bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">スタンダード ¥4,980/月</a>
          <a href="https://gumroad.com/l/REPLACE" target="_blank" rel="noopener noreferrer" className="block bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 text-sm">ビジネス ¥9,800/月（無制限）</a>
        </div>
        <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600">閉じる</button>
      </div>
    </div>
  );
}

export default function ClaimTool() {
  const [industry, setIndustry] = useState("");
  const [situation, setSituation] = useState("");
  const [claimContent, setClaimContent] = useState("");
  const [severity, setSeverity] = useState("通常");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setCount(parseInt(localStorage.getItem(KEY) || "0")); }, []);

  const isLimit = count >= FREE_LIMIT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimit) { setShowPaywall(true); return; }
    setLoading(true); setResult("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ industry, situation, claimContent, severity }) });
      if (res.status === 429) { setShowPaywall(true); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) { setResult(data.error || "エラーが発生しました"); setLoading(false); return; }
      const newCount = data.count ?? count + 1;
      localStorage.setItem(KEY, String(newCount));
      setCount(newCount);
      setResult(data.result || "生成に失敗しました");
      if (newCount >= FREE_LIMIT) setTimeout(() => setShowPaywall(true), 1500);
    } catch { setResult("通信エラーが発生しました。インターネット接続を確認してください。"); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} />}
      <nav className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-gray-900">AIクレーム対応文</Link>
          <span className={`text-xs px-3 py-1 rounded-full ${isLimit ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
            {isLimit ? "無料枠終了" : `無料あと${FREE_LIMIT - count}回`}
          </span>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-xl font-bold text-gray-900">クレーム情報を入力</h1>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">業種</label>
            <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="例: 飲食店・美容院・ECサイト" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状況</label>
            <input type="text" value={situation} onChange={e => setSituation(e.target.value)} placeholder="例: 料理の異物混入・配送遅延・接客態度" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">深刻度</label>
            <div className="flex gap-2">
              {["軽微", "通常", "重大"].map(s => (
                <button key={s} type="button" onClick={() => setSeverity(s)} className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${severity === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">クレーム内容 <span className="text-red-500">*</span></label>
            <textarea value={claimContent} onChange={e => setClaimContent(e.target.value)} rows={6} placeholder="お客様から受けたクレームの内容を入力してください" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" required />
          </div>
          <button type="submit" disabled={loading} className={`w-full font-medium py-3 rounded-lg text-white transition-colors ${isLimit ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"}`}>
            {loading ? "生成中..." : isLimit ? "有料プランに申し込む" : "対応文を生成する"}
          </button>
        </form>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">生成結果</label>
            {result && <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-blue-600 font-medium">{copied ? "コピーしました!" : "コピー"}</button>}
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" /><p className="text-sm text-gray-400">AIが対応文を作成しています...</p></div>
              </div>
            ) : result ? (
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400"><p className="text-sm text-center">クレーム内容を入力して<br />生成ボタンを押してください</p></div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
