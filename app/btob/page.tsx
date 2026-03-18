"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import KomojuButton from "@/components/KomojuButton";

const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

const PROBLEMS = [
  { icon: "👥", text: "スタッフごとに対応品質がバラバラ" },
  { icon: "😰", text: "新人が重大クレームに一人で対応してしまう" },
  { icon: "⚖️", text: "カスハラ判定基準がなく従業員を守れない" },
  { icon: "📋", text: "2026年10月義務化に向けた対応マニュアルがない" },
  { icon: "🏪", text: "複数店舗のクレーム対応を統一できていない" },
  { icon: "📁", text: "証拠記録が残らず、後でトラブルになる" },
  { icon: "⭐", text: "忙しいとき返信が後回しになりGoogleレビューが放置" },
  { icon: "🤔", text: "弁護士に相談するほどでもないが判断に困る" },
];

const FEATURES = [
  { icon: "♾️", title: "AI返信文・カスハラ断り文 生成無制限", desc: "件数上限なし。どの店舗のどのスタッフが使っても統一品質の返信文を即時生成。" },
  { icon: "📘", title: "カスハラ対応マニュアル（厚労省ガイドライン準拠）", desc: "2026年10月施行の義務化に対応した社内マニュアルのひな型を提供。そのまま社内展開できます。" },
  { icon: "🏢", title: "複数スタッフ共有・チームアカウント", desc: "ひとつの契約で複数スタッフが利用可能。店舗横断での品質統一を実現します。" },
  { icon: "🛡️", title: "悪質クレーマーへの毅然とした断り文生成", desc: "カスハラ・恫喝・不当要求に対して、法的に問題のない毅然とした断り文を生成。従業員を守ります。" },
  { icon: "🚀", title: "優先サポート（24時間以内返信）", desc: "重大クレームが発生したときも安心。専任サポートが24時間以内に対応します。" },
  { icon: "💰", title: "東京都奨励金¥40万の申請サポート情報提供", desc: "東京都カスハラ対策奨励金（最大¥40万）の申請要件・手続き情報を提供。実質無料化の道筋をサポート。" },
];

const FAQS = [
  {
    q: "何名まで使えますか？",
    a: "現在チームアカウント機能は開発中です。導入ご相談はXにてDMください（@levona_design）。",
  },
  {
    q: "請求書払い・銀行振込は対応していますか？",
    a: "X @levona_design にてご相談ください。法人のお客様には個別対応いたします。",
  },
  {
    q: "解約はいつでもできますか？",
    a: "次回更新前にX（@levona_design）でご連絡いただくか、お問い合わせください。違約金は一切ありません。",
  },
  {
    q: "まず試してから導入を検討したいのですが？",
    a: "/tool より無料で3回お試しいただけます。スタッフへの実演にもお使いください。",
  },
];

export default function BtobLP() {
  const [showPayjp, setShowPayjp] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date("2026-10-01");
    const diff = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    setDaysLeft(diff);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {showPayjp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setShowPayjp(false)} className="absolute top-3 right-3 text-gray-400 text-xl">✕</button>
            <div className="text-3xl mb-3 text-center">🏢</div>
            <h2 className="text-lg font-bold mb-2 text-center">ビジネスプラン</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">クレーム対応 無制限+専任サポート</p>
            <KomojuButton planId="standard" planLabel="ビジネスプラン ¥9,800/月" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
          </div>
        </div>
      )}

      {/* ナビゲーション */}
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-gray-900">🏢 クレームAI 法人向け</span>
          <Link
            href="/tool"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            無料で試す
          </Link>
        </div>
      </nav>

      {/* カスハラ義務化カウントダウンバナー */}
      <div className="bg-red-600 text-white text-center text-sm font-semibold py-2.5 px-4">
        🚨 カスハラ対策義務化まであと
        {daysLeft !== null ? <strong> {daysLeft}日 </strong> : ""}
        — 2026年10月1日施行
      </div>

      {/* ヒーローセクション */}
      <section style={{ backgroundColor: "#1e293b" }} className="px-6 py-20 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-blue-500/20 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full border border-blue-400/30 mb-6">
            法人・複数店舗向けプラン
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            カスハラ義務化対応を、<br />
            <span className="text-blue-400">チーム全員で。</span>
            <br className="md:hidden" />
            <span className="text-2xl md:text-4xl">¥9,800/月で始める</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg mb-4 max-w-2xl mx-auto leading-relaxed">
            飲食チェーン・EC企業・医療介護・ホテル・コールセンターなど<br className="hidden md:block" />
            複数スタッフが関わるすべての業種に。
          </p>
          <p className="text-gray-400 text-sm mb-10">
            2026年10月の義務化に向け、AI が返信文・カスハラ断り文・対応マニュアルを生成。<br className="hidden md:block" />
            属人的な対応から、チームで統一された対応品質へ。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowPayjp(true)}
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg shadow-blue-900/40 transition-colors"
            >
              法人プランで申し込む ¥9,800/月
            </button>
            <Link
              href="/tool"
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-xl text-base border border-white/20 transition-colors"
            >
              まず無料で試す →
            </Link>
          </div>
          <p className="text-gray-500 text-xs mt-4">※ 月額¥9,800（税込）。いつでも解約可能。</p>
        </div>
      </section>

      {/* 法人が抱える課題 */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              法人の現場リアル
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              こんな課題、抱えていませんか？
            </h2>
            <p className="text-sm text-gray-500">義務化を前に、多くの企業が同じ壁にぶつかっています</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROBLEMS.map((p, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-3 shadow-sm"
              >
                <span className="text-2xl leading-none mt-0.5">{p.icon}</span>
                <p className="text-sm text-gray-700 font-medium leading-snug">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ビジネスプランの機能 */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              ビジネスプラン 機能一覧
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              義務化対応に必要なすべてが揃う
            </h2>
            <p className="text-sm text-gray-500">¥9,800/月で、チーム全体をカスハラから守る仕組みを構築</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col gap-3"
              >
                <div className="text-3xl">{f.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm leading-snug">{f.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 価格比較表 */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              プラン比較
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              個人プランと法人プランの違い
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-5 py-4 font-semibold text-gray-700">項目</th>
                  <th className="text-center px-5 py-4 font-semibold text-gray-500">
                    スタンダード<br />
                    <span className="text-xs font-normal">¥2,980/月</span>
                  </th>
                  <th className="text-center px-5 py-4 font-bold text-blue-600 bg-blue-50">
                    ビジネス<br />
                    <span className="text-xs font-normal">¥9,800/月</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["月間生成件数", "100件", "無制限"],
                  ["スタッフ共有", "1名", "チーム全員"],
                  ["カスハラマニュアル", "—", "✓"],
                  ["優先サポート", "—", "✓"],
                  ["義務化対応証明", "—", "✓"],
                ].map(([label, std, biz], i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-700">{label}</td>
                    <td className="px-5 py-4 text-center text-gray-400">{std}</td>
                    <td className="px-5 py-4 text-center font-semibold text-blue-600 bg-blue-50/30">
                      {biz}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => setShowPayjp(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg shadow-blue-100 transition-colors"
            >
              法人プランで申し込む ¥9,800/月
            </button>
          </div>
        </div>
      </section>

      {/* 東京都奨励金セクション */}
      <section className="bg-yellow-50 border-y border-yellow-200 px-6 py-14">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-yellow-300">
            🎁 助成金情報
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            東京都カスハラ対策奨励金（最大¥40万）で<br className="hidden md:block" />
            <span className="text-yellow-700">実質無料化</span>できます
          </h2>
          <p className="text-gray-700 text-sm mb-6 leading-relaxed">
            東京都では、カスタマーハラスメント対策を実施した事業者に対し、最大¥40万の奨励金を支給しています。
            ビジネスプランの年間費用 <strong>¥117,600</strong> に対して、奨励金¥40万を活用すれば
            <strong className="text-yellow-700">初年度は実質¥0以下</strong>での導入が可能です。
          </p>
          <div className="bg-white border border-yellow-300 rounded-2xl p-6 inline-block text-left shadow-sm max-w-md mx-auto mb-4">
            <table className="text-sm w-full">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 pr-4 text-gray-600 font-medium">ビジネスプラン年額</td>
                  <td className="py-2 text-gray-900 font-bold text-right">¥117,600</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-gray-600 font-medium">東京都奨励金（最大）</td>
                  <td className="py-2 text-yellow-700 font-bold text-right">▲ ¥400,000</td>
                </tr>
                <tr className="border-t-2 border-yellow-400">
                  <td className="pt-3 pr-4 text-gray-900 font-bold">初年度 実質負担</td>
                  <td className="pt-3 text-green-600 font-bold text-xl text-right">¥0 以下</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500">
            ※ 要件・申請時期・支給額の上限は東京都しごと財団にご確認ください。奨励金は当社が保証するものではありません。
          </p>
        </div>
      </section>

      {/* 導入フロー */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              導入ステップ
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              申込から即日利用開始まで3ステップ
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "申込",
                desc: "法人プランに申し込み。クレジットカードで即時完了。請求書払いはX（@levona_design）にてご相談ください。",
              },
              {
                step: "2",
                title: "チーム設定",
                desc: "アカウント情報をチームに共有するだけ。特別なインストールや設定は不要。どのデバイスからもすぐ使えます。",
              },
              {
                step: "3",
                title: "即日利用開始",
                desc: "申込完了の瞬間からAI返信文・カスハラ断り文の生成が無制限に。マニュアルもその日から社内展開できます。",
              },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              よくある質問
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">FAQ</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                  <span className="text-gray-400 text-lg flex-shrink-0">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "#1e293b" }} className="px-6 py-20 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block bg-red-500/20 text-red-300 text-xs font-semibold px-3 py-1 rounded-full border border-red-400/30 mb-6">
            🚨 2026年10月 義務化まで残り
            {daysLeft !== null ? <strong> {daysLeft}日</strong> : ""}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            今すぐ義務化対応を始める
          </h2>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            対応が遅れるほど、従業員を守れないリスクが高まります。<br />
            ¥9,800/月で、チーム全体のカスハラ対応を今日から変えましょう。
          </p>
          <button
            onClick={() => setShowPayjp(true)}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-10 py-4 rounded-xl text-lg shadow-lg shadow-blue-900/40 transition-colors"
          >
            法人プランで申し込む ¥9,800/月
          </button>
          <p className="text-gray-500 text-xs mt-4">いつでも解約可能 / 違約金なし</p>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-gray-200 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>© 2026 ポッコリラボ</span>
          <div className="flex gap-6">
            <Link href="/legal" className="hover:text-gray-700 transition-colors">
              特商法
            </Link>
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
