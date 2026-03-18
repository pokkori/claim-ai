"use client";
import PayjpModal from "@/components/PayjpModal";
import { useState, useEffect } from "react";
import Link from "next/link";
import { track } from '@vercel/analytics';

const FREE_LIMIT = 3;
const KEY = "claim_use_count";
const HISTORY_KEY = "claim_history";

const CLAIM_TYPE_PRESETS = ["商品・品質不具合", "サービス遅延・キャンセル", "スタッフ対応", "請求・料金トラブル", "安全・衛生問題", "その他"];
const SEVERITY_OPTIONS = [
  { value: "軽度", label: "軽度", desc: "一般的な不満" },
  { value: "中度", label: "中度", desc: "強い不満・要求" },
  { value: "重度", label: "重度", desc: "脅迫・カスハラ" },
];

type Section = { title: string; icon: string; content: string };
type LevelInfo = { level: "軽度" | "中度" | "重度"; color: "green" | "yellow" | "red"; reason: string };
type ParsedResult = { sections: Section[]; raw: string };
type HistoryItem = { date: string; claimType: string; severity: string; result: string };

// 深刻度スコア変換（1〜10）
function severityToScore(level: LevelInfo): number {
  if (level.color === "red") return Math.floor(Math.random() * 3) + 8; // 8〜10
  if (level.color === "yellow") return Math.floor(Math.random() * 3) + 4; // 4〜6
  return Math.floor(Math.random() * 3) + 1; // 1〜3
}

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (/^## (.+)$/.test(line)) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(line.replace(/^## (.+)$/, '<h3 class="font-bold text-base mt-4 mb-2 text-blue-700 border-b border-blue-200 pb-1">$1</h3>'));
    } else if (/^# (.+)$/.test(line)) {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push(line.replace(/^# (.+)$/, '<h2 class="font-bold text-lg mt-4 mb-2 text-blue-800">$1</h2>'));
    } else if (/^- (.+)$/.test(line)) {
      if (!inList) { result.push('<ul class="space-y-1 mb-2">'); inList = true; }
      const inner = line.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      result.push(`<li class="ml-4 list-disc text-gray-700 text-sm">${inner}</li>`);
    } else if (/^[①②③④⑤⑥⑦⑧⑨⑩]/.test(line)) {
      if (!inList) { result.push('<ul class="space-y-1 mb-2">'); inList = true; }
      const inner = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      result.push(`<li class="ml-4 list-disc text-gray-700 text-sm">${inner}</li>`);
    } else if (line.trim() === '') {
      if (inList) { result.push('</ul>'); inList = false; }
      result.push('<div class="mt-2"></div>');
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      const inner = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
      result.push(`<p class="text-gray-700 text-sm leading-relaxed">${inner}</p>`);
    }
  }
  if (inList) result.push('</ul>');
  return result.join('\n');
}

function parseResult(text: string): ParsedResult {
  const sectionDefs = [
    { key: "口頭スクリプト", icon: "💬" },
    { key: "書面通知文", icon: "📄" },
    { key: "インシデント記録", icon: "📋" },
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
    sections.push({ title: "対応文", icon: "💬", content: text });
  }
  return { sections, raw: text };
}

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
          <button onClick={() => { track('upgrade_click', { service: 'クレームAI', plan: 'standard' }); onClose(); onCheckout?.("standard"); }} className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
            スタンダード ¥2,980/月
          </button>
          <button onClick={() => { track('upgrade_click', { service: 'クレームAI', plan: 'business' }); onClose(); onCheckout?.("business"); }} className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 text-sm">
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
    <div className="relative inline-block">
      <button onClick={handleCopy} className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-colors">
        {copied ? "コピー済み ✓" : label}
      </button>
      {copied && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap animate-bounce shadow-lg">
          ✅ コピー完了！
        </div>
      )}
    </div>
  );
}

// 達成感バナー
function CompletionBanner({ visible, levelInfo }: { visible: boolean; levelInfo: LevelInfo | null }) {
  const scoreNum = levelInfo ? severityToScore(levelInfo) : null;
  const scoreColor = levelInfo?.color === "red" ? "bg-red-500" : levelInfo?.color === "yellow" ? "bg-yellow-500" : "bg-green-500";
  const barWidth = scoreNum ? `${(scoreNum / 10) * 100}%` : "0%";

  return (
    <div className={`transition-all duration-500 overflow-hidden ${visible ? "max-h-40 opacity-100 mb-4" : "max-h-0 opacity-0"}`}>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-5 py-4 flex flex-col gap-2 shadow-lg">
        <div className="flex items-center gap-2 font-bold text-base">
          <span className="text-2xl animate-stamp">✅</span>
          <span>対応文書 作成完了！</span>
        </div>
        {levelInfo && scoreNum !== null && (
          <div className="mt-1">
            <div className="flex items-center justify-between text-xs mb-1 opacity-90">
              <span>クレームレベル: {levelInfo.level}</span>
              <span className="font-bold text-base">{scoreNum}<span className="text-xs font-normal">/10</span></span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5">
              <div
                className={`${scoreColor} h-2.5 rounded-full transition-all duration-700`}
                style={{ width: barWidth }}
              />
            </div>
            <p className="text-xs opacity-75 mt-1">{levelInfo.reason}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultTabs({ parsed, levelInfo }: { parsed: ParsedResult; levelInfo: LevelInfo | null }) {
  const [activeTab, setActiveTab] = useState(0);
  const section = parsed.sections[activeTab];

  const scoreNum = levelInfo ? severityToScore(levelInfo) : 6;
  const shareText = `「クレーム対応文が30秒で完成した🙌 レベル${scoreNum}/10のクレームにも完璧な解決策が出た → https://claim-ai-beryl.vercel.app #カスハラ対策 #クレーム対応AI #2026年義務化`;

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
        <div className="text-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }} />
      </div>

      <div className="flex gap-2 justify-end flex-wrap items-center">
        <CopyButton text={parsed.raw} label="全文コピー" />
        <button onClick={handlePrint} className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium">
          印刷・PDF保存
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg hover:scale-105 transition-transform"
        >
          𝕏 でシェアする
        </a>
      </div>
    </div>
  );
}

export default function ClaimTool() {
  const [claimType, setClaimType] = useState("");
  const [situation, setSituation] = useState("");
  const [severity, setSeverity] = useState("中度");
  const [showDetails, setShowDetails] = useState(false);
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
  const [completionVisible, setCompletionVisible] = useState(false);

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
      if (!res.ok) { setMaliciousError(data.error || "少し時間を置いてもう一度お試しください 🙏"); return; }
      setMaliciousResult(data.result || "");
    } catch { setMaliciousError("少し時間を置いてもう一度お試しください 🙏"); }
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

  const streamGenerate = async () => {
    track('ai_generated', { service: 'クレームAI' });
    setLoading(true); setParsed(null); setLevelInfo(null); setError(""); setCompletionVisible(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimType, situation, severity }),
      });
      if (res.status === 429) { track('paywall_shown', { service: 'クレームAI' }); setShowPaywall(true); setLoading(false); return; }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "少し時間を置いてもう一度お試しください 🙏"); setLoading(false); return;
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk.includes("\nDONE:")) {
          const idx = chunk.indexOf("\nDONE:");
          accumulated += chunk.slice(0, idx);
          try {
            const meta = JSON.parse(chunk.slice(idx + 6));
            const newCount = meta.count ?? count + 1;
            localStorage.setItem(KEY, String(newCount));
            setCount(newCount);
            if (meta.level) setLevelInfo(meta.level);
            if (newCount >= FREE_LIMIT) setTimeout(() => { track('paywall_shown', { service: 'クレームAI' }); setShowPaywall(true); }, 1500);
          } catch { /* ignore */ }
        } else {
          accumulated += chunk;
        }
        setParsed(parseResult(accumulated));
      }
      // 達成感バナー表示
      setCompletionVisible(true);
      setTimeout(() => setCompletionVisible(false), 4000);

      const newItem: HistoryItem = { date: new Date().toLocaleDateString("ja-JP"), claimType: claimType || "一般", severity, result: accumulated };
      const newHistory = [newItem, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch { setError("少し時間を置いてもう一度お試しください 🙏"); }
    finally { setLoading(false); }
  };

  const handleRegenerate = async () => {
    if (isLimit) { setShowPaywall(true); return; }
    await streamGenerate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimit) { setShowPaywall(true); return; }
    await streamGenerate();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} onCheckout={(p) => { setSelectedPlan(p); setShowPayjp(true); }} />}

      <nav className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-gray-900">⭐ クレームAI</Link>
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

            {/* クレームの状況（必須・1フィールドで即生成可能） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                クレームの状況を1行で <span className="text-red-500">*</span>
              </label>
              <textarea value={situation} onChange={e => setSituation(e.target.value)} rows={4}
                placeholder="例：お客様から商品に傷があると電話でお怒りを受けています"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" required />
              <p className="text-xs text-gray-400 mt-1">これだけで対応文を生成できます。詳細は下から任意で追加できます（{situation.length}/1000文字）</p>
            </div>

            {/* 詳細情報（折りたたみ・任意） */}
            <div>
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
              >
                <span>{showDetails ? "▼" : "▶"}</span>
                {showDetails ? "詳細情報を非表示" : "より正確な対応文のために詳細を入力（任意）"}
              </button>

              {showDetails && (
                <div className="mt-4 space-y-4 border border-blue-100 rounded-xl p-4 bg-blue-50/30">
                  <p className="text-xs text-gray-500">以下の情報を追加すると、より状況に合った対応文が生成されます。</p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">クレームの種類（任意）</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {CLAIM_TYPE_PRESETS.map(p => (
                        <button key={p} type="button" onClick={() => setClaimType(claimType === p ? "" : p)}
                          className={`px-3 py-1 rounded-full text-xs border font-medium transition-colors ${claimType === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                    <input type="text" value={claimType} onChange={e => setClaimType(e.target.value)} placeholder="または直接入力（例: 配送遅延、接客トラブル）"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">深刻度（任意）</label>
                    <div className="flex gap-2">
                      {SEVERITY_OPTIONS.map(s => (
                        <button key={s.value} type="button" onClick={() => setSeverity(s.value)}
                          className={`flex-1 py-2 px-1 rounded-lg border text-center transition-colors ${severity === s.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                          <div className="text-xs font-semibold">{s.label}</div>
                          <div className={`text-xs mt-0.5 ${severity === s.value ? "text-blue-100" : "text-gray-400"}`}>{s.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className={`w-full font-medium py-3 rounded-lg text-white transition-colors ${isLimit ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"}`}>
              {loading ? "対応文を生成中..." : isLimit ? "有料プランに申し込む" : "対応文を生成する（無料）"}
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

            {/* 達成感バナー */}
            <CompletionBanner visible={completionVisible} levelInfo={levelInfo} />

            {levelInfo?.color === "red" && (
              <div className="mb-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-xs text-red-700">
                ⚠️ <strong>重度クレームです。</strong>上長へのエスカレーション・書面対応・証拠記録を推奨します。カスハラに該当する可能性があります。
                <div className="mt-2 pt-2 border-t border-red-200">
                  法的対応・訴訟リスクがある場合は必ず専門家にご相談ください。→
                  <a href="https://www.nichibenren.or.jp/legal_advice/search/index.html" target="_blank" rel="noopener noreferrer"
                    className="ml-1 underline font-bold hover:text-red-900">日弁連 弁護士紹介サービス</a>
                </div>
              </div>
            )}
            {loading ? (
              <div className="flex-1 bg-white border border-gray-200 rounded-xl flex items-center justify-center min-h-[420px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">AIが対応文を作成中...</p>
                  <p className="text-xs text-gray-400 mt-2">💬 口頭スクリプト → 📄 書面通知文 → 📋 インシデント記録</p>
                  <p className="text-xs text-gray-300 mt-1">通常10〜15秒かかります</p>
                </div>
              </div>
            ) : parsed ? (
              <div className="animate-fade-in-up">
                <ResultTabs parsed={parsed} levelInfo={levelInfo} />
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="mt-2 text-sm text-gray-500 underline hover:text-gray-700 disabled:opacity-40"
                >
                  🔄 別のパターンで再生成
                </button>
                {/* 次のアクション3選 */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-bold text-blue-800 mb-3">📋 次にやるべきこと3選</p>
                  <ol className="space-y-2">
                    {[
                      { icon: "📝", text: "上長・責任者に今回のクレーム対応を報告・共有する" },
                      { icon: "🗂️", text: "クレーム記録票に日時・内容・対応方法を記録する" },
                      { icon: "📞", text: "悪質なケースは弁護士・警察・消費生活センターへ相談する" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="text-lg leading-none">{item.icon}</span>
                        <span>{i + 1}. {item.text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                {/* 通信費見直しアフィリエイト（A8.net ビッグローブ光） */}
                <div className="mt-4 bg-green-950 border border-green-800 rounded-xl p-4">
                  <p className="text-sm font-black text-green-300 mb-1">💡 業務コスト削減のヒント</p>
                  <p className="text-xs text-green-400 mb-3">クレーム対応と並行して通信費の見直しも。最短即日キャッシュバックで経費削減。</p>
                  <a
                    href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8D9CVM+3HKU+1BNBJN"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center justify-between bg-green-900 border border-green-700 rounded-xl px-3 py-2.5 hover:bg-green-800 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-bold text-green-100">ビッグローブ光</div>
                      <div className="text-xs text-green-400">最短即日キャッシュバック ¥8,000 • 工事費実質無料</div>
                    </div>
                    <span className="text-green-300 font-bold text-xs bg-green-800 border border-green-600 px-2 py-1 rounded-full shrink-0">詳細を見る →</span>
                  </a>
                  <p className="text-xs text-green-700 text-center mt-2">※ 広告・PR掲載</p>
                </div>
                {/* 弁護士相談アフィリエイト（A8.net申請後URLを差し替え） */}
                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-sm font-black text-slate-800 mb-1">⚖️ 悪質クレームは弁護士に相談</p>
                  <p className="text-xs text-slate-500 mb-3">脅迫・不当要求・カスハラは弁護士対応が最速解決。初回無料相談あり。</p>
                  <div className="space-y-2">
                    {/* TODO: Replace href with A8.net affiliate URL after approval */}
                    <a href="https://www.bengo4.com/c_1011/" target="_blank" rel="noopener noreferrer sponsored"
                      className="flex items-center justify-between bg-white border border-slate-300 rounded-xl px-3 py-2.5 hover:bg-blue-50 transition-colors">
                      <div>
                        <div className="text-sm font-bold text-slate-800">弁護士ドットコム</div>
                        <div className="text-xs text-slate-500">初回無料 • 全国対応 • 企業向け顧問契約も</div>
                      </div>
                      <span className="text-blue-600 font-bold text-xs bg-blue-50 border border-blue-200 px-2 py-1 rounded-full shrink-0">無料相談 →</span>
                    </a>
                  </div>
                  <p className="text-xs text-slate-400 text-center mt-2">※ 広告・PR掲載</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center min-h-[420px] text-gray-400 gap-3">
                <div className="text-4xl">⭐</div>
                <p className="text-sm text-center font-medium text-gray-500">クレーム状況を入力して<br />生成ボタンを押してください</p>
                <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-2 w-full max-w-[260px]">
                  <p className="font-semibold text-gray-600">生成される内容：</p>
                  <p className="text-gray-500">💬 口頭スクリプト（電話・対面対応用）</p>
                  <p className="text-gray-500">📄 書面通知文（メール・FAX送付用）</p>
                  <p className="text-gray-500">📋 インシデント記録テンプレート</p>
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
                <div className="relative inline-block">
                  <button
                    onClick={handleMaliciousCopy}
                    className="text-xs px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium transition-colors"
                  >
                    {maliciousCopied ? "コピー済み ✓" : "コピー"}
                  </button>
                  {maliciousCopied && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap animate-bounce shadow-lg">
                      ✅ コピー完了！
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(maliciousResult) }} />
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
              <span>対応履歴（直近{history.length}件）</span>
              <span className="text-gray-400">{showHistory ? "▲ 閉じる" : "▼ 表示する"}</span>
            </button>
            {showHistory && (
              <div className="mt-4 space-y-3">
                {history.map((item, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span className="font-medium text-gray-600">{item.claimType} / {item.severity}</span>
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
          planLabel={(selectedPlan === "business" ? "ビジネス ¥9,800/月" : "スタンダード ¥2,980/月")}
          plan={selectedPlan}
          onSuccess={() => setShowPayjp(false)}
          onClose={() => setShowPayjp(false)}
        />
      )}
    </main>
  );
}
