"use client";
import PayjpModal from "@/components/PayjpModal";
import { useState, useEffect } from "react";
import Link from "next/link";

const FREE_LIMIT = 3;
const KEY = "review_count";
const HISTORY_KEY = "review_history";

const INDUSTRY_PRESETS = ["飲食店", "美容・サロン", "クリニック・歯科", "ホテル・旅館", "不動産", "小売店"];
const TONE_OPTIONS = [
  { value: "丁寧", label: "丁寧・謙虚", desc: "誠実な感謝中心" },
  { value: "プロ", label: "プロ・簡潔", desc: "信頼感を演出" },
  { value: "親しみ", label: "親しみやすい", desc: "温かみある文体" },
];

type Section = { title: string; icon: string; content: string };
type LevelInfo = { level: "軽度" | "中度" | "重度"; color: "green" | "yellow" | "red"; reason: string };
type ParsedResult = { sections: Section[]; raw: string };
type HistoryItem = { date: string; industry: string; rating: string; result: string };

function parseResult(text: string): ParsedResult {
  const sectionDefs = [
    { key: "返信文", icon: "💬" },
    { key: "感謝文", icon: "🌟" },
    { key: "SEOアドバイス", icon: "📈" },
    { key: "別パターン", icon: "✏️" },
  ];
  const sections: Section[] = [];
  const parts = text.split(/^---$/m);
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const matched = sectionDefs.find(s => trimmed.includes(s.key));
    if (matched) {
      const content = trimmed.replace(/^##\s.*$/m, "").trim();
      sections.push({ title: matched.key, icon: matched.icon, content });
    }
  }
  if (sections.length === 0) {
    sections.push({ title: "生成結果", icon: "💬", content: text });
  }
  return { sections, raw: text };
}

// startCheckout replaced by PayjpModal

function Paywall({ onClose, onCheckout }: { onClose: () => void; onCheckout?: (plan: string) => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
        <div className="text-3xl mb-3">⭐</div>
        <h2 className="text-lg font-bold mb-2">無料枠を使い切りました</h2>
        <p className="text-sm text-gray-500 mb-1">クレーム対応文を無制限に生成</p>
        <ul className="text-xs text-gray-400 text-left mb-5 space-y-1 mt-3">
          <li>✓ クレーム対応文・電話スクリプトを無制限生成</li>
          <li>✓ 業種別・深刻度別に最適化</li>
          <li>✓ 悪質クレーマー対応の断り文生成</li>
          <li>✓ 対応履歴を無制限保存</li>
        </ul>
        <div className="space-y-3 mb-4">
          <button onClick={() => { onClose(); onCheckout?.("standard"); }} className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
            スタンダード ¥4,980/月
          </button>
          <button onClick={() => { onClose(); onCheckout?.("business"); }} className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 text-sm">
            ビジネス ¥9,800/月（無制限・チーム対応）
          </button>
        </div>
        <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600">閉じる</button>
      </div>
    </div>
  );
}

function CopyButton({ text, label = "コピー" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-colors">
      {copied ? "コピー済み ✓" : label}
    </button>
  );
}

function ResultTabs({ parsed }: { parsed: ParsedResult }) {
  const [activeTab, setActiveTab] = useState(0);
  const section = parsed.sections[activeTab];

  const handlePrint = () => {
    const html = `<html><head><title>クレーム対応文</title><style>body{font-family:sans-serif;padding:32px;line-height:1.8;white-space:pre-wrap;}</style></head><body>${parsed.raw.replace(/</g, "&lt;")}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    w?.addEventListener("load", () => { w.print(); URL.revokeObjectURL(url); });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 flex-wrap">
        {parsed.sections.map((s, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <span>{s.icon}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-[360px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">{section.icon} {section.title}</span>
          <CopyButton text={section.content} />
        </div>
        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{section.content}</pre>
      </div>

      <div className="flex gap-2 justify-end">
        <CopyButton text={parsed.raw} label="全文コピー" />
        <button onClick={handlePrint} className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium">
          印刷・PDF保存
        </button>
      </div>
    </div>
  );
}

export default function ReviewTool() {
  const [industry, setIndustry] = useState("");
  const [rating, setRating] = useState("★3");
  const [reviewContent, setReviewContent] = useState("");
  const [tone, setTone] = useState("丁寧");
  const [parsed, setParsed] = useState<ParsedResult | null>(null);
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPayjp, setShowPayjp] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState("");

  // 悪質クレーマー対応モード
  const [maliciousText, setMaliciousText] = useState("");
  const [maliciousResult, setMaliciousResult] = useState("");
  const [maliciousLoading, setMaliciousLoading] = useState(false);
  const [maliciousError, setMaliciousError] = useState("");
  const [maliciousCopied, setMaliciousCopied] = useState(false);

  const handleMaliciousSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMaliciousLoading(true);
    setMaliciousResult("");
    setMaliciousError("");
    try {
      const res = await fetch("/api/generate/malicious", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimText: maliciousText }),
      });
      const data = await res.json();
      if (!res.ok) { setMaliciousError(data.error || "エラーが発生しました"); return; }
      setMaliciousResult(data.result || "");
    } catch { setMaliciousError("通信エラーが発生しました。インターネット接続を確認してください。"); }
    finally { setMaliciousLoading(false); }
  };

  const handleMaliciousCopy = () => {
    navigator.clipboard.writeText(maliciousResult);
    setMaliciousCopied(true);
    setTimeout(() => setMaliciousCopied(false), 2000);
  };

  useEffect(() => {
    setCount(parseInt(localStorage.getItem(KEY) || "0"));
    const h = localStorage.getItem(HISTORY_KEY);
    if (h) try { setHistory(JSON.parse(h)); } catch { /* ignore */ }
  }, []);

  const isLimit = count >= FREE_LIMIT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimit) { setShowPaywall(true); return; }
    setLoading(true); setParsed(null); setLevelInfo(null); setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, rating, reviewContent, tone }),
      });
      if (res.status === 429) { setShowPaywall(true); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) { setError(data.error || "エラーが発生しました"); setLoading(false); return; }
      const newCount = data.count ?? count + 1;
      localStorage.setItem(KEY, String(newCount));
      setCount(newCount);
      const text = data.result || "";
      if (data.level) setLevelInfo(data.level);
      const p = parseResult(text);
      setParsed(p);
      const newItem: HistoryItem = { date: new Date().toLocaleDateString("ja-JP"), industry: industry || "一般", rating, result: text };
      const newHistory = [newItem, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      if (newCount >= FREE_LIMIT) setTimeout(() => setShowPaywall(true), 1500);
    } catch { setError("通信エラーが発生しました。インターネット接続を確認してください。"); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} onCheckout={(p) => { setSelectedPlan(p); setShowPayjp(true); }} />}

      <nav className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-gray-900">⭐ Google口コミ返信AI</Link>
          <span className={`text-xs px-3 py-1 rounded-full ${isLimit ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
            {isLimit ? "無料枠終了" : `無料あと${FREE_LIMIT - count}回`}
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 入力フォーム */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900">口コミ情報を入力</h1>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">業種</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {INDUSTRY_PRESETS.map(p => (
                  <button key={p} type="button" onClick={() => setIndustry(industry === p ? "" : p)}
                    className={`px-3 py-1 rounded-full text-xs border font-medium transition-colors ${industry === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
                    {p}
                  </button>
                ))}
              </div>
              <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="または直接入力（例: カフェ、整骨院）"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">評価（星）</label>
              <div className="flex gap-2">
                {["★1", "★2", "★3", "★4", "★5"].map(r => (
                  <button key={r} type="button" onClick={() => setRating(r)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${rating === r ? "bg-yellow-400 text-white border-yellow-400" : "bg-white text-gray-700 border-gray-300 hover:border-yellow-300"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">返信トーン</label>
              <div className="flex gap-2">
                {TONE_OPTIONS.map(t => (
                  <button key={t.value} type="button" onClick={() => setTone(t.value)}
                    className={`flex-1 py-2 px-1 rounded-lg border text-center transition-colors ${tone === t.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                    <div className="text-xs font-semibold">{t.label}</div>
                    <div className={`text-xs mt-0.5 ${tone === t.value ? "text-blue-100" : "text-gray-400"}`}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                口コミ内容 <span className="text-red-500">*</span>
              </label>
              <textarea value={reviewContent} onChange={e => setReviewContent(e.target.value)} rows={5}
                placeholder="例：料理は美味しかったのですが、待ち時間が長すぎました。スタッフの方は親切でしたが、もう少し効率よく対応してほしいです。"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" required />
              <p className="text-xs text-gray-400 mt-1">口コミ文をそのまま貼り付けてください（{reviewContent.length}/1000文字）</p>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full font-medium py-3 rounded-lg text-white transition-colors ${isLimit ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"}`}>
              {loading ? "返信文を生成中..." : isLimit ? "有料プランに申し込む" : "返信文を生成する（無料）"}
            </button>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </form>

          {/* 出力エリア */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">生成結果</label>
              {levelInfo && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  levelInfo.color === "red" ? "bg-red-50 text-red-700 border-red-200" :
                  levelInfo.color === "yellow" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                  "bg-green-50 text-green-700 border-green-200"
                }`}>
                  <span>{levelInfo.color === "red" ? "🔴" : levelInfo.color === "yellow" ? "🟡" : "🟢"}</span>
                  <span>クレームレベル: {levelInfo.level}</span>
                  <span className="text-xs font-normal opacity-75">— {levelInfo.reason}</span>
                </div>
              )}
            </div>
            {levelInfo?.color === "red" && (
              <div className="mb-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-xs text-red-700">
                ⚠️ <strong>重度クレームです。</strong>上長へのエスカレーション・書面対応・証拠記録を推奨します。カスハラに該当する可能性があります。
              </div>
            )}
            {loading ? (
              <div className="flex-1 bg-white border border-gray-200 rounded-xl flex items-center justify-center min-h-[420px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">AIが返信文を作成中...</p>
                  <p className="text-xs text-gray-400 mt-2">💬 返信文 → 🌟 感謝文 → 📈 SEO → ✏️ 別パターン</p>
                  <p className="text-xs text-gray-300 mt-1">通常10〜15秒かかります</p>
                </div>
              </div>
            ) : parsed ? (
              <ResultTabs parsed={parsed} />
            ) : (
              <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center min-h-[420px] text-gray-400 gap-3">
                <div className="text-4xl">⭐</div>
                <p className="text-sm text-center font-medium text-gray-500">口コミ内容を入力して<br />生成ボタンを押してください</p>
                <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-2 w-full max-w-[260px]">
                  <p className="font-semibold text-gray-600">生成される内容：</p>
                  <p className="text-gray-500">💬 返信文（そのままコピペ可）</p>
                  <p className="text-gray-500">🌟 感謝文（高評価口コミ向け）</p>
                  <p className="text-gray-500">📈 SEOアドバイス（検索露出アップ）</p>
                  <p className="text-gray-500">✏️ 別パターン（2〜3パターン）</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 悪質クレーマー対応モード */}
        <div className="mt-10 bg-white border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">悪質クレーマー対応</span>
            <h2 className="text-base font-bold text-gray-900">毅然とした断り文を生成</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">不当要求・カスハラ・脅迫的なクレームに対して、法的根拠のある丁寧な断り文を生成します。</p>

          <form onSubmit={handleMaliciousSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                クレーム・不当要求の内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={maliciousText}
                onChange={e => setMaliciousText(e.target.value)}
                rows={5}
                placeholder="例：「SNSで拡散してやる」「弁護士を呼ぶ」「返金しなければ消費者センターに訴える」など、受けたクレームや不当要求の内容を入力してください。"
                className="w-full border border-red-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                required
              />
              <p className="text-xs text-gray-400 mt-1">受けたクレーム内容をそのまま貼り付けてください（{maliciousText.length}/1000文字）</p>
            </div>

            <button
              type="submit"
              disabled={maliciousLoading}
              className="w-full font-medium py-3 rounded-lg text-white transition-colors bg-red-600 hover:bg-red-700 disabled:bg-red-300"
            >
              {maliciousLoading ? "断り文を生成中..." : "断り文を生成する"}
            </button>

            {maliciousError && <p className="text-sm text-red-500 text-center">{maliciousError}</p>}
          </form>

          {maliciousLoading && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center py-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-medium">法的根拠のある断り文を作成中...</p>
                <p className="text-xs text-gray-400 mt-1">通常5〜10秒かかります</p>
              </div>
            </div>
          )}

          {maliciousResult && !maliciousLoading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-red-700">生成された断り文</span>
                <button
                  onClick={handleMaliciousCopy}
                  className="text-xs px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium transition-colors"
                >
                  {maliciousCopied ? "コピー済み ✓" : "コピー"}
                </button>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{maliciousResult}</pre>
              </div>
              <p className="text-xs text-gray-400 mt-2">※ 社名・担当者名・日付は実際のものに変更してご使用ください。法的措置の実施は必ず専門家（弁護士）にご相談ください。</p>
            </div>
          )}
        </div>

        {/* 履歴 */}
        {history.length > 0 && (
          <div className="mt-8 bg-white border border-gray-200 rounded-xl p-4">
            <button onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-700">
              <span>返信履歴（直近{history.length}件）</span>
              <span className="text-gray-400">{showHistory ? "▲ 閉じる" : "▼ 表示する"}</span>
            </button>
            {showHistory && (
              <div className="mt-4 space-y-3">
                {history.map((item, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span className="font-medium text-gray-600">{item.industry} / {item.rating}</span>
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
      {showPayjp && (
        <PayjpModal
          publicKey={process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY!}
          planLabel={(selectedPlan === "business" ? "ビジネス ¥9,800/月" : "スタンダード ¥4,980/月")}
          plan={selectedPlan}
          onSuccess={() => setShowPayjp(false)}
          onClose={() => setShowPayjp(false)}
        />
      )}
    </main>
  );
}
