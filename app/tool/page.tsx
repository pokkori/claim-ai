"use client";
import KomojuButton from "@/components/KomojuButton";
import { GlowButton } from "@/components/GlowButton";
import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { track } from '@vercel/analytics';
import { updateStreak, loadStreak, getStreakMilestoneMessage, type StreakData } from "@/lib/streak";
import { useTypewriter } from "@/lib/useTypewriter";

const FREE_LIMIT = 3;
const KEY = "claim_use_count";
const HISTORY_KEY = "claim_history";

const INDUSTRY_PRESETS = [
  { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: "飲食店" },
  { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: "EC・通販" },
  { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: "美容・サロン" },
  { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: "ホテル・旅館" },
  { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: "小売店" },
  { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: "医療・介護" },
  { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8M12 17v4" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: "IT・SaaS" },
  { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: "コールセンター" },
];
const CLAIM_TYPE_PRESETS = ["商品・品質不具合", "サービス遅延・キャンセル", "スタッフ対応", "請求・料金トラブル", "安全・衛生問題", "その他"];
const SEVERITY_OPTIONS = [
  { value: "軽度", label: "軽度", desc: "一般的な不満" },
  { value: "中度", label: "中度", desc: "強い不満・要求" },
  { value: "重度", label: "重度", desc: "脅迫・カスハラ" },
];
const REPLY_STYLE_OPTIONS = [
  { value: "穏便型", label: "穏便型", desc: "まず謝罪・関係維持を優先した返答" },
  { value: "毅然型", label: "毅然型", desc: "事実を明確にし、不当なクレームには毅然と対応" },
  { value: "記録型", label: "記録型", desc: "証拠保全・エスカレーション準備を意識した返答" },
];

type Section = { title: string; icon: string; content: string };
type LevelInfo = { level: "軽度" | "中度" | "重度"; color: "green" | "yellow" | "red"; reason: string };
type ParsedResult = { sections: Section[]; raw: string };
type HistoryItem = { date: string; claimType: string; severity: string; result: string };

// カスハラ重篤度判定（1〜5）
type SeverityLevel = 1 | 2 | 3 | 4 | 5;

interface SeverityResult {
  level: SeverityLevel;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  recommendation: string;
}

function analyzeSeverity(claimText: string): SeverityResult {
  const text = claimText.toLowerCase();

  const level5Words = ["殺す", "殺すぞ", "殺してやる", "死ね", "爆破", "放火", "訴える", "警察", "弁護士に", "マスコミに", "sns で晒す", "snsに晒す", "炎上", "さらし"];
  if (level5Words.some(w => text.includes(w))) {
    return { level: 5, label: "最重大・法的対応検討", description: "脅迫・炎上リスクを含む深刻なクレーム", color: "text-red-700", bgColor: "bg-red-50 border-red-300", recommendation: "上長への即時エスカレーション・証拠保全が必要です" };
  }

  const level4Words = ["ありえない", "なめてる", "最悪", "二度と", "全額返金", "責任者", "謝罪しろ", "土下座", "どういうつもり", "こんな会社"];
  if (level4Words.some(w => text.includes(w))) {
    return { level: 4, label: "重大・上長対応推奨", description: "強い怒りと具体的な要求を含む高リスククレーム", color: "text-orange-700", bgColor: "bg-orange-50 border-orange-300", recommendation: "上長への報告と慎重な文面での対応が必要です" };
  }

  const level3Words = ["どうなってる", "なぜ", "おかしい", "納得できない", "改善", "対応してください", "早く", "いつまで", "何度も"];
  if (level3Words.some(w => text.includes(w))) {
    return { level: 3, label: "要注意・丁寧な対応必要", description: "具体的な不満と改善要求があるクレーム", color: "text-yellow-700", bgColor: "bg-yellow-50 border-yellow-300", recommendation: "丁寧な謝罪と具体的な改善策の提示が効果的です" };
  }

  const level2Words = ["困った", "問題", "不満", "残念", "残念です", "期待してた", "思ってた"];
  if (level2Words.some(w => text.includes(w))) {
    return { level: 2, label: "軽微・標準対応", description: "軽微な不満を含むクレーム", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-300", recommendation: "標準的な謝罪と改善対応で解決可能です" };
  }

  return { level: 1, label: "軽微・情報提供で解決", description: "問い合わせ・確認レベル", color: "text-green-700", bgColor: "bg-green-50 border-green-300", recommendation: "情報提供と丁寧な説明で解決できます" };
}

function SeverityBadge({ level, label, description, color, bgColor, recommendation }: SeverityResult) {
  const dots = [1, 2, 3, 4, 5];
  const dotColor =
    level >= 5 ? "bg-red-500" :
    level >= 4 ? "bg-orange-500" :
    level >= 3 ? "bg-yellow-500" :
    level >= 2 ? "bg-blue-500" : "bg-green-500";
  return (
    <div className={`border-2 rounded-xl p-4 mb-4 ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-gray-700">カスハラ重篤度</span>
        <span className={`text-sm font-bold px-3 py-0.5 rounded-full bg-white ${color}`}>{label}</span>
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        {dots.map(d => (
          <div
            key={d}
            className={`h-4 flex-1 rounded-full transition-all ${d <= level ? dotColor : "bg-gray-200"}`}
            role="img"
            aria-label={`重篤度 ${d}`}
          />
        ))}
        <span className={`text-lg font-black ml-1 ${color}`}>{level}/5</span>
      </div>
      <p className="text-xs text-gray-600 mb-1">{description}</p>
      <p className={`text-xs font-semibold ${color}`}>→ {recommendation}</p>
    </div>
  );
}

// 深刻度スコア変換（1〜10）
function severityToScore(level: LevelInfo): number {
  if (level.color === "red") return Math.floor(Math.random() * 3) + 8; // 8〜10
  if (level.color === "yellow") return Math.floor(Math.random() * 3) + 4; // 4〜6
  return Math.floor(Math.random() * 3) + 1; // 1〜3
}

// StreamingWordReveal: ストリーミング中のテキストを単語単位でフェードイン表示
// 新しいテキストが追加されるたびに末尾の単語がフェードインする
function StreamingWordReveal({ text, className = "" }: { text: string; className?: string }) {
  const [revealedText, setRevealedText] = useState("");
  const [pendingWords, setPendingWords] = useState<string[]>([]);
  const prevLengthRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (text.length > prevLengthRef.current) {
      const newChunk = text.slice(prevLengthRef.current);
      prevLengthRef.current = text.length;
      const words = newChunk.split(/(\s+)/).filter(w => w.length > 0);
      setPendingWords(prev => [...prev, ...words]);
    }
  }, [text]);

  useEffect(() => {
    if (pendingWords.length === 0) return;
    if (timerRef.current) return;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setPendingWords(prev => {
        if (prev.length === 0) return prev;
        setRevealedText(rt => rt + prev[0]);
        return prev.slice(1);
      });
    }, 15);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pendingWords]);

  return (
    <span className={className}>
      <span>{revealedText}</span>
      {pendingWords.length > 0 && (
        <span className="animate-pulse opacity-50">{pendingWords[0]}</span>
      )}
    </span>
  );
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
    { key: "口頭スクリプト", icon: "S" },
    { key: "書面通知文", icon: "D" },
    { key: "インシデント記録", icon: "R" },
    { key: "別パターン", icon: "A" },
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
    sections.push({ title: "対応文", icon: "S", content: text });
  }
  return { sections, raw: text };
}

function Paywall({ onClose, onCheckout }: { onClose: () => void; onCheckout?: (plan: string) => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center relative">
        <button onClick={onClose} aria-label="ペイウォールモーダルを閉じる" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
        <div className="mb-3"><svg className="w-10 h-10 mx-auto text-yellow-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg></div>
        <h2 className="text-lg font-bold mb-2">無料枠を使い切りました</h2>
        <p className="text-sm text-gray-500 mb-1">クレーム対応文を無制限に生成</p>
        <ul className="text-xs text-gray-400 text-left mb-5 space-y-1 mt-3">
          <li>✓ クレーム対応文・電話スクリプトを無制限生成</li>
          <li>✓ 業種別・深刻度別に最適化</li>
          <li>✓ 悪質クレーマー対応の断り文生成</li>
          <li>✓ 対応履歴を無制限保存</li>
        </ul>
        <div className="space-y-3 mb-4">
          <KomojuButton
            planId="standard"
            planLabel="スタンダード ¥2,980/月"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
          <KomojuButton
            planId="business"
            planLabel="ビジネス ¥9,800/月（無制限・チーム対応）"
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
        </div>
        <button onClick={onClose} aria-label="ペイウォールモーダルを閉じる" className="text-xs text-gray-400 hover:text-gray-600">閉じる</button>
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
      <button onClick={handleCopy} aria-label={`${label}をクリップボードにコピーする`} className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-colors">
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
          <svg className="w-7 h-7 text-white animate-stamp" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
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
  const shareText = `「クレーム対応文が30秒で完成した🙌 レベル${scoreNum}/10のクレームにも完璧な解決策が出た → https://claim-ai.vercel.app #カスハラ対策 #クレーム対応AI #2026年義務化`;

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
            aria-label={`${s.title}タブを表示する`}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            <span>{s.icon}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      <div className="backdrop-blur-sm bg-white/95 border border-gray-200 rounded-xl p-4 min-h-[360px] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">{section.icon} {section.title}</span>
          <CopyButton text={section.content} />
        </div>
        <div className="text-sm" dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }} />
      </div>

      <div className="flex gap-2 justify-end flex-wrap items-center">
        <CopyButton text={parsed.raw} label="全文コピー" />
        <button onClick={handlePrint} aria-label="クレーム対応文を印刷またはPDFとして保存する" className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium">
          印刷・PDF保存
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="クレーム対応結果をXにシェアする"
          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg hover:scale-105 transition-transform"
        >
          𝕏 でシェアする
        </a>
      </div>
    </div>
  );
}

export default function ClaimTool() {
  const [industry, setIndustry] = useState("");
  const [claimType, setClaimType] = useState("");
  const [situation, setSituation] = useState("");
  const [severity, setSeverity] = useState("中度");
  const [replyStyle, setReplyStyle] = useState("穏便型");
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [streakMsg, setStreakMsg] = useState<string | null>(null);

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
    setStreak(loadStreak("claim"));
  }, []);

  const isLimit = count >= FREE_LIMIT;

  const severityAnalysis = useMemo(() => {
    if (situation.length < 50) return null;
    return analyzeSeverity(situation);
  }, [situation]);

  const streamGenerate = async () => {
    track('ai_generated', { service: 'クレームAI' });
    setLoading(true); setParsed(null); setLevelInfo(null); setError(""); setCompletionVisible(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimType, situation, severity, replyStyle, industry }),
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
      // ストリーク更新
      const s = updateStreak("claim");
      setStreak(s);
      const msg = getStreakMilestoneMessage(s.count);
      if (msg) setStreakMsg(msg);
      // 達成感バナー表示 + シェアモーダル
      setCompletionVisible(true);
      setTimeout(() => setCompletionVisible(false), 4000);
      setTimeout(() => setShowShareModal(true), 2000);

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

  const scoreNum = levelInfo ? severityToScore(levelInfo) : 6;
  const shareModalText = `クレームAIで対応文が完成しました！レベル${scoreNum}/10のクレームにも即対応できました ✅ → https://claim-ai.vercel.app #クレーム対応AI #カスハラ対策`;

  return (
    <main className="min-h-screen" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(120,119,198,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255,119,198,0.1) 0%, transparent 50%), #0F0F1A' }}>
      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} onCheckout={(p) => { setSelectedPlan(p); setShowPayjp(true); }} />}

      {/* シェアモーダル */}
      {showShareModal && parsed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowShareModal(false)} aria-label="シェアモーダルを閉じる" className="absolute top-3 right-3 text-gray-400 text-xl font-bold">×</button>
            <div className="mb-3"><svg className="w-10 h-10 mx-auto text-indigo-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
            <h2 className="text-lg font-bold mb-2">対応文が完成しました！</h2>
            <p className="text-sm text-gray-500 mb-4">このクレームへの対応方法をXでシェアしませんか？同じ悩みを持つ方に役立ちます。</p>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareModalText)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowShareModal(false)}
              aria-label="クレーム対応結果をXにシェアする"
              className="flex items-center justify-center gap-2 w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors mb-3"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Xでシェアする
            </a>
            <button onClick={() => setShowShareModal(false)} aria-label="シェアモーダルを閉じる" className="text-xs text-gray-400 hover:text-gray-600">閉じる</button>
          </div>
        </div>
      )}

      <nav className="backdrop-blur-sm bg-white/5 border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" aria-label="クレームAI トップページへ戻る" className="font-bold text-white flex items-center gap-1.5"><svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/></svg> クレームAI</Link>
          <span className={`text-xs px-3 py-1 rounded-full ${isLimit ? "bg-red-500/20 text-red-300" : "bg-indigo-500/20 text-indigo-300"}`}>
            {isLimit ? "無料枠終了" : `無料あと${FREE_LIMIT - count}回`}
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 入力フォーム */}
          <form onSubmit={handleSubmit} className="space-y-4 backdrop-blur-md bg-white/5 border border-white/10 shadow-lg rounded-2xl p-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-rounded)' }}>クレーム情報を入力</h1>
            {streak && streak.count > 0 && (
              <div className="mt-2 inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 rounded-full px-3 py-1 text-sm text-orange-300">
                <span>{streak.count}日連続利用中</span>
              </div>
            )}
            {streakMsg && <div className="text-orange-600 font-bold text-sm animate-bounce">{streakMsg}</div>}

            {/* 業種セレクター */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                業種を選ぶ <span className="text-gray-500 text-xs font-normal">（任意・より正確な対応文になります）</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {INDUSTRY_PRESETS.map(({ icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={`業種：${label}を選択する`}
                    onClick={() => setIndustry(industry === label ? "" : label)}
                    className={`flex flex-col items-center gap-0.5 px-2 py-2.5 rounded-xl border-2 text-center transition-colors ${
                      industry === label
                        ? "border-blue-600 bg-blue-50 text-blue-800"
                        : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/40"
                    }`}
                  >
                    <span className="text-lg">{icon}</span>
                    <span className="text-xs font-medium leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* クレームの状況（必須・1フィールドで即生成可能） */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                クレームの状況を1行で <span className="text-red-500">*</span>
              </label>
              {/* よくあるクレームプリセット */}
              <div className="mb-2 flex flex-wrap gap-1.5">
                {[
                  { label: "📦 商品不良", text: "お客様から商品に傷・汚れがあったとお怒りの電話を受けています。" },
                  { label: "🚚 配送遅延", text: "注文から2週間経っても商品が届かないと、お客様から強いお怒りを受けています。" },
                  { label: "😠 接客対応", text: "スタッフの言葉遣いが悪かったとのお申し出があり、「謝罪しろ」「責任者を出せ」とのクレームを受けています。" },
                  { label: "💴 返金要求", text: "購入した商品が説明と違うとして、全額返金と慰謝料を要求されています。" },
                  { label: "📱 SNS脅迫", text: "対応が悪いとして「SNSで晒す」「口コミに書く」と脅され、不当な要求を受けています。" },
                ].map((p) => (
                  <button key={p.label} type="button" onClick={() => setSituation(p.text)}
                    aria-label={`${p.label}をクレーム状況として使用する`}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors font-medium">
                    {p.label}
                  </button>
                ))}
              </div>
              <textarea value={situation} onChange={e => setSituation(e.target.value)} rows={4}
                placeholder="例：お客様から商品に傷があると電話でお怒りを受けています"
                aria-label="クレーム状況を入力する"
                className="w-full bg-white/60 border border-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] resize-none transition-all" required />
              <p className="text-xs text-gray-400 mt-1">これだけで対応文を生成できます。詳細は下から任意で追加できます（{situation.length}/1000文字）</p>
              {severityAnalysis && (
                <div className="mt-3">
                  <SeverityBadge {...severityAnalysis} />
                </div>
              )}
            </div>

            {/* 返答スタイル選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">返答スタイル</label>
              <div className="flex gap-2 flex-wrap">
                {REPLY_STYLE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-label={`返答スタイルを${opt.value}に設定する`}
                    onClick={() => setReplyStyle(opt.value)}
                    className={`flex-1 min-w-[90px] flex flex-col items-center gap-0.5 px-2 py-2.5 rounded-xl border-2 text-center transition-colors ${
                      replyStyle === opt.value
                        ? "border-blue-600 bg-blue-50 text-blue-800"
                        : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <span className="text-sm font-bold">{opt.label}</span>
                    <span className={`text-xs leading-tight ${replyStyle === opt.value ? "text-blue-600" : "text-gray-400"}`}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 詳細情報（折りたたみ・任意） */}
            <div>
              <button
                type="button"
                aria-label={showDetails ? "詳細情報を非表示にする" : "詳細情報を表示する"}
                aria-expanded={showDetails}
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
                    <label className="block text-sm font-medium text-gray-300 mb-1">クレームの種類（任意）</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {CLAIM_TYPE_PRESETS.map(p => (
                        <button key={p} type="button" onClick={() => setClaimType(claimType === p ? "" : p)}
                          aria-label={`クレームの種類：${p}を選択する`}
                          className={`px-3 py-1 rounded-full text-xs border font-medium transition-colors ${claimType === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                    <input type="text" value={claimType} onChange={e => setClaimType(e.target.value)} placeholder="または直接入力（例: 配送遅延、接客トラブル）"
                      aria-label="クレームの種類を直接入力する"
                      className="w-full bg-white/60 border border-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">深刻度（任意）</label>
                    <div className="flex gap-2">
                      {SEVERITY_OPTIONS.map(s => (
                        <button key={s.value} type="button" onClick={() => setSeverity(s.value)}
                          aria-label={`深刻度を${s.value}に設定する`}
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

            <GlowButton
              type="submit"
              disabled={loading}
              aria-label={loading ? "クレーム対応文を生成中" : "クレーム対応文を生成する"}
              aria-busy={loading}
              variant={isLimit ? "danger" : "primary"}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                  対応文を生成中...
                </span>
              ) : isLimit ? "有料プランに申し込む" : "対応文を生成する（無料）"}
            </GlowButton>

            {error && <p className="text-sm text-red-500 text-center" role="alert">{error}</p>}
          </form>

          {/* 出力エリア */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">生成結果</label>
              {levelInfo && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  levelInfo.color === "red" ? "bg-red-50 text-red-700 border-red-200" :
                  levelInfo.color === "yellow" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                  "bg-green-50 text-green-700 border-green-200"
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full inline-block ${levelInfo.color === "red" ? "bg-red-500" : levelInfo.color === "yellow" ? "bg-yellow-500" : "bg-green-500"}`} aria-hidden="true" />
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
                    aria-label="日弁連 弁護士紹介サービス（外部サイト）"
                    className="ml-1 underline font-bold hover:text-red-900">日弁連 弁護士紹介サービス</a>
                </div>
              </div>
            )}
            {loading && !parsed ? (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[420px] p-6" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.36)' }}>
                <div className="text-center mb-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 font-medium">AIが対応文を作成中...</p>
                </div>
                {/* Skeleton pulse */}
                <div className="w-full space-y-3">
                  <div className="h-4 bg-gray-200/70 rounded-lg animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200/70 rounded-lg animate-pulse w-full" />
                  <div className="h-4 bg-gray-200/70 rounded-lg animate-pulse w-5/6" />
                  <div className="h-4 bg-gray-200/70 rounded-lg animate-pulse w-2/3" />
                  <div className="h-4 bg-gray-200/70 rounded-lg animate-pulse w-full" />
                </div>
                <p className="text-xs text-gray-400 mt-2">口頭スクリプト → 書面通知文 → インシデント記録</p>
                <p className="text-xs text-gray-300 mt-1">通常10〜15秒かかります</p>
              </div>
            ) : loading && parsed ? (
              <div className="flex-1 p-4 min-h-[420px]" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.36)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                  <span className="text-xs text-gray-500">AIが対応文を生成中...</span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  <StreamingWordReveal text={parsed.raw} />
                </div>
              </div>
            ) : parsed ? (
              <div className="animate-fade-in-up">
                <ResultTabs parsed={parsed} levelInfo={levelInfo} />
                {/* 法的準拠チェックバッジ */}
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-gray-600 mb-2">法的準拠チェック（生成文に反映済み）</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "✅ 消費者契約法準拠",
                      "✅ 厚労省カスハラ指針2023準拠",
                      "✅ 過剰謝罪表現を排除",
                      "✅ 証拠保全フレーズ含む",
                      "✅ エスカレーション基準明示",
                    ].map((badge, i) => (
                      <span key={i} className="text-xs bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded-full">{badge}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  aria-label="別のパターンでクレーム対応文を再生成する"
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
                    aria-label="ビッグローブ光 公式サイトへ（PR・外部サイト）"
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
                      aria-label="弁護士ドットコム 無料法律相談へ（PR・外部サイト）"
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

                {/* SOELUアフィリエイト（A8.net）*/}
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm font-black text-green-800 mb-1">🧘 クレーム対応で疲れたら、ヨガでリセット</p>
                  <p className="text-xs text-green-700 mb-3">オンラインヨガSOELUで心身のリフレッシュを。初月無料・スマホで自宅から受講できます。</p>
                  <a
                    href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8OKLDE+4EPM+63OY9"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    aria-label="SOELU オンラインヨガ 無料体験へ（PR・外部サイト）"
                    className="flex items-center justify-between bg-white border border-green-300 rounded-xl px-3 py-2.5 hover:bg-green-50 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-800">SOELU（ソエル）オンラインヨガ</div>
                      <div className="text-xs text-slate-500">初月無料 • 朝5時〜夜23時 • 毎日600レッスン以上</div>
                    </div>
                    <span className="text-green-600 font-bold text-xs bg-green-100 border border-green-200 px-2 py-1 rounded-full shrink-0">無料体験 →</span>
                  </a>
                  <p className="text-xs text-slate-400 text-center mt-2">※ 広告・PR掲載</p>
                </div>
                {/* FPカフェアフィリエイト（A8.net）*/}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-black text-blue-800 mb-1">💰 専門家に相談する（PR）</p>
                  <p className="text-xs text-blue-700 mb-3">法的問題・弁護士費用の資金繰りもFPに相談。無料でお金の専門家に相談できます。</p>
                  <a
                    href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+2SMA0I+5ULO+5YZ75"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    aria-label="FPカフェ お金の専門家に無料相談へ（PR・外部サイト）"
                    className="flex items-center justify-between bg-white border border-blue-300 rounded-xl px-3 py-2.5 hover:bg-blue-50 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-800">FPカフェ — お金の専門家に無料相談</div>
                      <div className="text-xs text-slate-500">弁護士費用・資金繰りの悩みを解決 • 全国対応</div>
                    </div>
                    <span className="text-blue-600 font-bold text-xs bg-blue-100 border border-blue-200 px-2 py-1 rounded-full shrink-0">無料相談 →</span>
                  </a>
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
                aria-label="悪質クレーム・不当要求の内容を入力する"
                className="w-full border border-red-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                required
              />
              <p className="text-xs text-gray-400 mt-1">受けたクレーム内容をそのまま貼り付けてください（{maliciousText.length}/1000文字）</p>
            </div>

            <GlowButton
              type="submit"
              disabled={maliciousLoading}
              aria-label={maliciousLoading ? "断り文を生成中" : "悪質クレームへの断り文を生成する"}
              aria-busy={maliciousLoading}
              variant="danger"
            >
              {maliciousLoading ? "断り文を生成中..." : "断り文を生成する"}
            </GlowButton>

            {maliciousError && <p className="text-sm text-red-500 text-center" role="alert">{maliciousError}</p>}
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
                    aria-label="生成された断り文をクリップボードにコピーする"
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
              aria-label={showHistory ? "対応履歴を閉じる" : "対応履歴を表示する"}
              aria-expanded={showHistory}
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
                      aria-label={`${item.claimType}の対応文全文をコピーする`}
                      className="text-xs text-blue-600 mt-2 hover:underline">全文をコピー</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="text-center py-6 text-xs text-gray-400 border-t mt-8">
        <a href="/legal" aria-label="特定商取引法に基づく表記ページへ" className="hover:underline">特定商取引法に基づく表記</a>
        <span className="mx-2">|</span>
        <a href="/privacy" aria-label="プライバシーポリシーページへ" className="hover:underline">プライバシーポリシー</a>
      </footer>
      {showPayjp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setShowPayjp(false)} aria-label="プレミアムプランモーダルを閉じる" className="absolute top-3 right-3 text-gray-400 text-xl">✕</button>
            <div className="text-3xl mb-3 text-center">🆘</div>
            <h2 className="text-lg font-bold mb-2 text-center">プレミアムプラン</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">{selectedPlan === "business" ? "ビジネスプラン — クレーム対応 無制限+専任サポート" : "スタンダードプラン — クレーム対応 無制限"}</p>
            <KomojuButton planId="standard" planLabel={selectedPlan === "business" ? "ビジネス ¥9,800/月" : "スタンダード ¥2,980/月"} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
          </div>
        </div>
      )}
    </main>
  );
}
