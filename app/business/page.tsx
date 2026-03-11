"use client";

import Link from "next/link";
import { useState } from "react";

const PROBLEMS = [
  { title: "カスハラ対策法施行でマニュアル整備が急務", desc: "2025年4月施行のカスタマーハラスメント対策法に対応。AIで対応品質を即座に標準化。" },
  { title: "ベテランが辞めたらクレーム対応の質が落ちた", desc: "属人化したスキルをAIで標準化。誰でも即戦力に。" },
  { title: "新人スタッフが感情的な返信をして炎上した", desc: "AIが生成した文章をコピペするだけ。感情に左右されない。" },
  { title: "月に何件もクレームがありその都度時間を取られる", desc: "1件あたり5〜10分 → 30秒。月の対応工数を90%削減。" },
];

const USECASES = [
  {
    icon: "🍽",
    title: "飲食チェーン店",
    problem: "異物混入・食中毒の疑い・接客クレームが頻発。SNS拡散リスクが高い。",
    solution: "深刻度「重大」設定で法的リスクを考慮した対応文を即生成。初動30分の対応を標準化。",
    result: "クレーム対応時間を平均1時間 → 5分に短縮",
  },
  {
    icon: "📦",
    title: "EC・通販企業",
    problem: "配送トラブル・返品返金クレームのメール対応に毎日2〜3時間。CSスタッフの離職も。",
    solution: "注文番号・商品名を入れるだけで完全なメール文が生成。コピペして送信するだけ。",
    result: "CS一人あたりの対応件数が2.5倍に向上",
  },
  {
    icon: "🏨",
    title: "ホテル・旅館",
    problem: "OTAレビューへの悪影響が予約数に直結。深夜のクレームでも即対応が必要。",
    solution: "電話スクリプトで深夜フロントでも迷わず対応。翌日のメールフォローも自動生成。",
    result: "OTA評価が平均3.8 → 4.2に改善",
  },
];

const PLANS = [
  {
    name: "スタンダード",
    price: "¥4,980",
    per: "/月",
    target: "小規模店舗・個人事業主",
    features: ["月100件まで生成", "全業種対応", "メール・電話・チェックリスト", "履歴保存"],
    cta: "まず1ヶ月お試し ¥4,980",
    highlight: false,
  },
  {
    name: "ビジネス",
    price: "¥9,800",
    per: "/月",
    target: "複数スタッフ・チェーン店向け",
    features: ["無制限生成", "チームアカウント（5名）", "全機能＋優先サポート", "使い方レクチャー付き", "請求書払い対応"],
    cta: "まず1ヶ月お試し ¥9,800",
    highlight: true,
  },
  {
    name: "エンタープライズ",
    price: "要相談",
    per: "",
    target: "10店舗以上・フランチャイズ本部",
    features: ["アカウント数無制限", "カスタムプロンプト設定", "社内マニュアル連携", "専任サポート担当"],
    cta: "お問い合わせ",
    highlight: false,
  },
];

const ONBOARDING_STEPS = [
  {
    day: "今日",
    title: "申し込む（5分）",
    desc: "クレジットカードで即時決済。フォーム入力はメールアドレスのみ。",
    icon: "📝",
    color: "bg-blue-600",
  },
  {
    day: "明日",
    title: "すぐに使える",
    desc: "登録完了メールが届いたら即ログイン可能。スタッフへの共有も当日中に完了。",
    icon: "🚀",
    color: "bg-green-500",
  },
  {
    day: "1週間後",
    title: "効果を実感",
    desc: "クレーム対応時間が激減し、スタッフのストレスが軽減。対応品質が均一化される。",
    icon: "📈",
    color: "bg-purple-500",
  },
];

const FAQ_ITEMS = [
  {
    q: "複数アカウントで使えますか？",
    a: "ビジネスプランでは5名まで同時利用できます。エンタープライズプランはアカウント数無制限です。各スタッフが独自の履歴・設定を持てます。",
  },
  {
    q: "社内の文体・トーンに合わせられますか？",
    a: "エンタープライズプランではカスタムプロンプト設定が可能です。自社のトンマナ・補償基準・禁止用語などを反映した対応文を生成できます。スタンダード・ビジネスプランでも「丁寧・標準・毅然・強硬」の4段階トーン選択が可能です。",
  },
  {
    q: "セキュリティ・個人情報はどう扱われますか？",
    a: "入力した顧客情報はAI生成のみに使用され、第三者への提供や学習データへの利用は一切行いません。通信はすべてHTTPS暗号化。サーバーへのデータ保存は最小限（履歴機能のみ）で、いつでも削除可能です。",
  },
  {
    q: "無料トライアルはありますか？",
    a: "登録不要・カード不要で3回無料でお試しいただけます。まずは実際の品質を無料でご確認ください。デジタルコンテンツの性質上、決済完了後の返金は承っておりません。",
  },
  {
    q: "自社のクレーム対応マニュアルを学習させられますか？",
    a: "エンタープライズプランでカスタムプロンプト設定が可能です。社内マニュアル・禁止用語・補償基準などをAIに組み込み、ブランドに沿った対応文を生成できます。",
  },
  {
    q: "請求書払い・銀行振込は対応していますか？",
    a: "ビジネスプラン以上で請求書払いに対応しています。月次・四半期・年次払いが選べます。経理処理のしやすい形でご請求書を発行します。",
  },
  {
    q: "導入に技術的な知識は必要ですか？",
    a: "一切不要です。ブラウザからURLにアクセスするだけで使えます。システム連携や特別なインストールは不要。スタッフへの説明も5分で完了します。",
  },
  {
    q: "解約はいつでもできますか？",
    a: "はい、いつでも解約可能です。解約後は次回更新日まで引き続きご利用いただけます。解約手続きはマイページから1クリックで完了します。",
  },
];

function ROICalculator() {
  const [claimsPerMonth, setClaimsPerMonth] = useState(50);
  const [minutesPerClaim, setMinutesPerClaim] = useState(40);
  const hourlyWage = 2500; // 人件費 ¥2,500/時間（目安）

  const totalMinutesSaved = claimsPerMonth * (minutesPerClaim - 0.5); // AIなら30秒
  const hoursSaved = Math.round(totalMinutesSaved / 60);
  const costSaved = Math.round((totalMinutesSaved / 60) * hourlyWage);
  const roi = costSaved - 4980; // スタンダードプランとの差額

  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-6 md:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">ROI計算機</h3>
      <p className="text-sm text-gray-500 text-center mb-8">スライダーを動かして、あなたの会社での削減効果を計算</p>

      <div className="space-y-6 mb-8">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">月のクレーム件数</label>
            <span className="text-2xl font-bold text-blue-600">{claimsPerMonth}件</span>
          </div>
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={claimsPerMonth}
            onChange={(e) => setClaimsPerMonth(Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>10件</span>
            <span>500件</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">現在の1件あたり対応時間</label>
            <span className="text-2xl font-bold text-blue-600">{minutesPerClaim}分</span>
          </div>
          <input
            type="range"
            min={10}
            max={120}
            step={5}
            value={minutesPerClaim}
            onChange={(e) => setMinutesPerClaim(Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>10分</span>
            <span>120分</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-xs text-blue-600 font-semibold mb-1">月の節約時間</p>
          <p className="text-3xl font-bold text-blue-700">{hoursSaved}<span className="text-lg">時間</span></p>
          <p className="text-xs text-gray-500 mt-1">AIなら1件30秒</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-xs text-green-600 font-semibold mb-1">人件費削減額</p>
          <p className="text-3xl font-bold text-green-700">¥{(costSaved / 10000).toFixed(1)}<span className="text-lg">万</span></p>
          <p className="text-xs text-gray-500 mt-1">時給¥2,500換算</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${roi > 0 ? "bg-purple-50" : "bg-gray-50"}`}>
          <p className={`text-xs font-semibold mb-1 ${roi > 0 ? "text-purple-600" : "text-gray-500"}`}>月額¥4,980との差引</p>
          <p className={`text-3xl font-bold ${roi > 0 ? "text-purple-700" : "text-gray-500"}`}>
            {roi > 0 ? "+" : ""}¥{(roi / 10000).toFixed(1)}<span className="text-lg">万</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{roi > 0 ? "純コスト削減" : "もう少し増えると効果大"}</p>
        </div>
      </div>

      {roi > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white text-center">
          <p className="text-sm font-bold mb-1">
            月{claimsPerMonth}件のクレームがある貴社なら、月額¥4,980の投資で
          </p>
          <p className="text-2xl font-bold">
            月¥{Math.round(roi / 10000 * 10) / 10}万円のコスト削減
          </p>
          <p className="text-blue-200 text-xs mt-1">ROI {Math.round((roi / 4980) * 100)}%（月次）</p>
        </div>
      )}

      <div className="mt-4 text-center">
        <Link
          href="/tool"
          className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 shadow-md text-sm"
        >
          まず1ヶ月お試し ¥4,980 →
        </Link>
      </div>
    </div>
  );
}

export default function BusinessLP() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-gray-900">AIクレーム対応文 <span className="text-blue-600 text-sm font-medium ml-2">法人向け</span></span>
          <div className="flex gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">個人向けはこちら</Link>
            <Link href="/tool" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">無料で試す</Link>
          </div>
        </div>
      </nav>

      {/* カスハラ法制化バナー */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-center text-sm text-amber-800">
        <span className="font-bold">📢 2025年4月施行</span>：カスタマーハラスメント対策法により、企業のクレーム対応マニュアル整備が義務化。
        <span className="font-bold ml-1">今すぐAIで対応品質を標準化しましょう。</span>
      </div>

      {/* ヒーロー */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          飲食チェーン・EC企業・ホテル向け法人プラン
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          スタッフ全員の<br />クレーム対応品質を<span className="text-blue-600">統一する</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          ベテランも新人も同じ品質で対応できる。<br />AIがメール文・電話スクリプト・チェックリストをセットで30秒生成。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100">
            まず1ヶ月お試し ¥4,980 →
          </Link>
          <Link href="/contact" className="inline-block bg-gray-100 text-gray-700 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-200">
            法人見積もりを依頼
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">解約はいつでも可能</p>
      </section>

      {/* ROI スタッツ */}
      <section className="bg-blue-600 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            {[
              { num: "90%", label: "クレーム対応工数の削減", sub: "1時間 → 5分" },
              { num: "¥12万", label: "月の人件費削減効果", sub: "CS担当者1名分に相当" },
              { num: "2.5倍", label: "CSスタッフの対応件数向上", sub: "同じ人数でより多く対応" },
            ].map(stat => (
              <div key={stat.num}>
                <div className="text-4xl font-bold mb-1">{stat.num}</div>
                <div className="text-sm font-medium text-blue-100">{stat.label}</div>
                <div className="text-xs text-blue-200 mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI計算機 */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">あなたの会社での削減効果を計算する</h2>
          <p className="text-center text-gray-500 text-sm mb-10">クレーム件数を入力するだけで、月間コスト削減額が即座にわかります</p>
          <ROICalculator />
        </div>
      </section>

      {/* 導入ステップ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">導入はたったの3ステップ</h2>
          <p className="text-center text-gray-500 text-sm mb-12">今日申し込めば、明日から全スタッフが使えます</p>
          <div className="relative">
            {/* 接続線（デスクトップ） */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-blue-100" style={{left: "16.67%", right: "16.67%"}} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ONBOARDING_STEPS.map((step, i) => (
                <div key={i} className="text-center relative">
                  <div className={`w-20 h-20 rounded-full ${step.color} text-white text-3xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    {step.icon}
                  </div>
                  <div className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
                    {step.day}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100">
              まず1ヶ月お試し ¥4,980 →
            </Link>
            <p className="text-xs text-gray-400 mt-3">解約はいつでも可能</p>
          </div>
        </div>
      </section>

      {/* 課題 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">こんな課題を解決します</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROBLEMS.map(p => (
              <div key={p.title} className="bg-white rounded-xl p-5 border border-gray-100">
                <p className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="text-red-500 shrink-0 mt-0.5">✗</span>{p.title}
                </p>
                <p className="text-sm text-gray-500 flex items-start gap-2">
                  <span className="text-green-500 shrink-0 mt-0.5">→</span>{p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 業種別ユースケース */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">業種別の導入効果</h2>
          <div className="space-y-5">
            {USECASES.map(u => (
              <div key={u.title} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{u.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900">{u.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-1">課題</p>
                    <p className="text-sm text-gray-600">{u.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-500 mb-1">解決策</p>
                    <p className="text-sm text-gray-600">{u.solution}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-600 mb-1">導入効果</p>
                    <p className="text-sm font-bold text-green-700">{u.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">法人向け料金プラン</h2>
          <p className="text-center text-gray-500 text-sm mb-10">すべてのプランでメール文・電話スクリプト・チェックリストがフルセット</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name} className={`rounded-2xl border p-6 relative flex flex-col ${plan.highlight ? "border-blue-500 shadow-xl shadow-blue-50 bg-white" : "border-gray-200 bg-white"}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-blue-600 text-white px-3 py-0.5 rounded-full whitespace-nowrap">法人に一番人気</div>
                )}
                <p className="text-xs text-gray-400 mb-1">{plan.target}</p>
                <p className="font-bold text-gray-900 text-lg mb-1">{plan.name}</p>
                <p className="text-3xl font-bold text-blue-600 mb-5">
                  {plan.price}<span className="text-sm font-normal text-gray-500">{plan.per}</span>
                </p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500 shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.cta === "お問い合わせ" ? "/contact" : "/tool"}
                  className={`block w-full text-center text-sm font-bold py-3 rounded-xl ${plan.highlight ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">解約はいつでも可能</p>
        </div>
      </section>

      {/* CTA（中間） */}
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto bg-blue-600 rounded-2xl p-8 text-center text-white">
          <p className="text-sm font-semibold text-blue-200 mb-2">まずは実際の品質を体感してください</p>
          <h2 className="text-2xl font-bold mb-4">今日申し込めば、明日から全スタッフが使えます</h2>
          <Link href="/tool" className="inline-block bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 shadow-lg">
            まず1ヶ月お試し ¥4,980 →
          </Link>
          <p className="text-blue-200 text-xs mt-3">解約はいつでも可能</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">よくある質問（法人向け）</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2 text-sm">Q. {faq.q}</p>
                <p className="text-sm text-gray-600">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 最終CTA */}
      <section className="bg-blue-600 py-16 text-center px-6">
        <h2 className="text-2xl font-bold text-white mb-3">クレーム対応コストを、今月から削減する</h2>
        <p className="text-blue-100 text-sm mb-8">解約はいつでも可能。リスクなくお試しいただけます。</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/tool" className="inline-block bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 shadow-lg">
            まず1ヶ月お試し ¥4,980 →
          </Link>
          <Link href="/contact" className="inline-block bg-blue-500 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-400">
            法人見積もりを依頼
          </Link>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-xs text-gray-400 space-x-4">
        <Link href="/legal" className="hover:underline">特定商取引法に基づく表記</Link>
        <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
      </footer>
    </main>
  );
}
