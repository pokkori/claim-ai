"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const FREE_LIMIT = 3;
const KEY = "claim_count";
const HISTORY_KEY = "claim_history";

const INDUSTRY_PRESETS = ["飲食店", "EC・通販", "美容・サロン", "小売店", "ホテル・旅館", "医療・介護", "IT・サービス"];
const SITUATION_PRESETS = ["料理への異物混入", "配送遅延・紛失", "接客態度への不満", "商品不良・破損", "予約ミス・キャンセル", "料金・請求トラブル"];

type HistoryItem = { date: string; industry: string; situation: string; result: string };

async function startCheckout(plan: string) {
  const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
  const { url } = await res.json();
  if (url) window.location.href = url;
}

function Paywall({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
        <div className="text-3xl mb-3">💼</div>
        <h2 className="text-lg font-bold mb-2">無料枠を使い切りました</h2>
        <p className="text-sm text-gray-500 mb-5">引き続きご利用いただくには有料プランをご選択ください</p>
        <div className="space-y-3 mb-4">
          <button onClick={() => startCheckout("standard")} className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">スタンダード ¥4,980/月</button>
          <button onClick={() => startCheckout("business")} className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 text-sm">ビジネス ¥9,800/月（無制限・チーム対応）</button>
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
  const [tone, setTone] = useState("丁寧");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setCount(parseInt(localStorage.getItem(KEY) || "0"));
    const h = localStorage.getItem(HISTORY_KEY);
    if (h) try { setHistory(JSON.parse(h)); } catch { /* ignore */ }
  }, []);

  const isLimit = count >= FREE_LIMIT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimit) { setShowPaywall(true); return; }
    setLoading(true); setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, situation, claimContent, severity, tone }),
      });
      if (res.status === 429) { setShowPaywall(true); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) { setResult(data.error || "エラーが発生しました"); setLoading(false); return; }
      const newCount = data.count ?? count + 1;
      localStorage.setItem(KEY, String(newCount));
      setCount(newCount);
      const text = data.result || "";
      setResult(text);
      const newItem: HistoryItem = { date: new Date().toLocaleDateString("ja-JP"), industry: industry || "一般", situation: situation || "クレーム", result: text };
      const newHistory = [newItem, ...history].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      if (newCount >= FREE_LIMIT) setTimeout(() => setShowPaywall(true), 1500);
    } catch { setResult("通信エラーが発生しました。インターネット接続を確認してください。"); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} />}

      <nav className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-gray-900">AIクレーム対応文</Link>
          <span className={`text-xs px-3 py-1 rounded-full ${isLimit ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
            {isLimit ? "無料枠終了" : `無料あと${FREE_LIMIT - count}回`}
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 入力フォーム */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900">クレーム情報を入力</h1>

            {/* 業種 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">業種</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {INDUSTRY_PRESETS.map(p => (
                  <button key={p} type="button" onClick={() => setIndustry(p)}
                    className={`px-3 py-1 rounded-full text-xs border font-medium transition-colors ${industry === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
                    {p}
                  </button>
                ))}
              </div>
              <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="または直接入力（例: 不動産、自動車販売）"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* 状況 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状況</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {SITUATION_PRESETS.map(p => (
                  <button key={p} type="button" onClick={() => setSituation(p)}
                    className={`px-3 py-1 rounded-full text-xs border font-medium transition-colors ${situation === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
                    {p}
                  </button>
                ))}
              </div>
              <input type="text" value={situation} onChange={e => setSituation(e.target.value)} placeholder="または直接入力"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* 深刻度 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">深刻度</label>
              <div className="flex gap-2">
                {["軽微", "通常", "重大"].map(s => (
                  <button key={s} type="button" onClick={() => setSeverity(s)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${severity === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* トーン */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">対応トーン</label>
              <div className="flex gap-2">
                {[
                  { value: "丁寧", label: "丁寧・謙虚", desc: "誠実な謝罪中心" },
                  { value: "毅然", label: "毅然・プロ", desc: "事実を明確に" },
                  { value: "強硬", label: "強硬・法的", desc: "法的根拠を示す" },
                ].map(t => (
                  <button key={t.value} type="button" onClick={() => setTone(t.value)}
                    className={`flex-1 py-2 px-1 rounded-lg border text-center transition-colors ${tone === t.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                    <div className="text-xs font-semibold">{t.label}</div>
                    <div className={`text-xs mt-0.5 ${tone === t.value ? "text-blue-100" : "text-gray-400"}`}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* クレーム内容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">クレーム内容 <span className="text-red-500">*</span></label>
              <textarea value={claimContent} onChange={e => setClaimContent(e.target.value)} rows={5}
                placeholder="お客様から受けたクレームの内容を入力してください"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" required />
            </div>

            <button type="submit" disabled={loading}
              className={`w-full font-medium py-3 rounded-lg text-white transition-colors ${isLimit ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"}`}>
              {loading ? "生成中..." : isLimit ? "有料プランに申し込む" : "対応文セットを生成する"}
            </button>
          </form>

          {/* 出力エリア */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">生成結果</label>
              {result && (
                <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="text-xs text-blue-600 font-medium">
                  {copied ? "コピーしました!" : "コピー"}
                </button>
              )}
            </div>
            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 min-h-[420px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">AIが対応文セットを作成しています...</p>
                    <p className="text-xs text-gray-300 mt-1">メール文・電話スクリプト・チェックリストを生成中</p>
                  </div>
                </div>
              ) : result ? (
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                  <div className="text-4xl">💼</div>
                  <p className="text-sm text-center">クレーム内容を入力して<br />生成ボタンを押してください</p>
                  <ul className="text-xs text-gray-300 text-left space-y-1">
                    <li>✓ メール返信文（そのまま使えます）</li>
                    <li>✓ 電話対応スクリプト</li>
                    <li>✓ 対応チェックリスト</li>
                    <li>✓ 顧客満足に変えるアドバイス</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 履歴 */}
        {history.length > 0 && (
          <div className="mt-8 bg-white border border-gray-200 rounded-xl p-4">
            <button onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-700">
              <span>対応履歴（直近{history.length}件）</span>
              <span className="text-gray-400">{showHistory ? "▲ 閉じる" : "▼ 表示する"}</span>
            </button>
            {showHistory && (
              <div className="mt-4 space-y-3">
                {history.map((item, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span className="font-medium text-gray-600">{item.industry} / {item.situation}</span>
                      <span>{item.date}</span>
                    </div>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap max-h-24 overflow-y-auto leading-relaxed">{item.result.slice(0, 200)}...</pre>
                    <button onClick={() => { navigator.clipboard.writeText(item.result); }}
                      className="text-xs text-blue-600 mt-2 hover:underline">全文をコピー</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="text-center py-6 text-xs text-gray-400 border-t mt-8">
        <a href="/legal" className="hover:underline">特定商取引法に基づく表記</a>
        <span className="mx-2">|</span>
        <a href="/privacy" className="hover:underline">プライバシーポリシー</a>
      </footer>
    </main>
  );
}
