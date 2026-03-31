import Link from "next/link";

const ITEMS = [
  { label: "販売業者", value: "新美諭" },
  { label: "電話番号", value: "090-6093-5290" },
  { label: "運営責任者", value: "ポッコリラボ 代表 新美諭" },
  { label: "所在地", value: "非公開（請求があれば遅滞なく開示します）" },
  { label: "お問い合わせ", value: "levonadesign@gmail.com（X: @levona_design）" },
  { label: "販売価格", value: "スタンダードプラン ¥980/月、ビジネスプラン ¥2,980/月（税込）" },
  { label: "支払方法", value: "クレジットカード（オンライン決済サービス経由）（Visa・Mastercard・American Express・JCB）" },
  { label: "支払時期", value: "お申込み時に即時決済。以降、毎月同日に自動更新" },
  { label: "サービス提供時期", value: "決済完了後、即時ご利用いただけます" },
  { label: "商品代金以外の必要料金", value: "なし" },
  { label: "返品・キャンセル", value: "デジタルコンテンツの性質上、決済完了後の返金は承っておりません。解約はいつでもマイページより行えます。解約後は次回更新日まで引き続きご利用いただけます" },
  { label: "動作環境", value: "インターネット接続環境および最新版ブラウザが必要です" },
];

export default function LegalPage() {
  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg, #0f0b15 0%, #1a1333 25%, #0d1f2d 50%, #1a1333 75%, #0f0b15 100%)" }}>
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />
      </div>

      <nav className="relative z-10 border-b border-white/5 px-6 py-4">
        <Link href="/" className="font-bold text-white/80 hover:text-white transition-colors flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          AIクレーム対応文
        </Link>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">特定商取引法に基づく表記</h1>
        <p className="text-slate-500 text-sm mb-8">Act on Specified Commercial Transactions</p>

        <div className="rounded-2xl p-6 sm:p-8" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <dl className="space-y-4">
            {ITEMS.map((item, i) => (
              <div key={item.label} className={i < ITEMS.length - 1 ? "border-b border-white/5 pb-4" : "pb-0"}>
                <dt className="text-sm font-semibold text-slate-400 mb-1">{item.label}</dt>
                <dd className="text-slate-200 text-sm leading-relaxed">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
