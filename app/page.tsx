"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import PayjpModal from "@/components/PayjpModal";

const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";


const INDUSTRIES = [
  { icon: "🍽", name: "飲食店", examples: ["料理への異物混入", "食中毒の疑い", "接客態度のクレーム"], pain: "SNS拡散リスクが高い業種。初動の30分が勝負。" },
  { icon: "📦", name: "EC・通販", examples: ["配送遅延・紛失", "商品不良・破損", "返品・返金トラブル"], pain: "レビュー評価への影響が直接売上に直結。" },
  { icon: "✂", name: "美容・サロン", examples: ["施術結果への不満", "予約ミス・キャンセル", "アレルギー・肌トラブル"], pain: "リピーター離脱を防ぐ対応が最優先。" },
  { icon: "🏨", name: "ホテル・旅館", examples: ["設備不具合・騒音", "料理・衛生クレーム", "スタッフ対応への不満"], pain: "OTA評価への影響。迅速な補償提示が鍵。" },
  { icon: "🏪", name: "小売店", examples: ["商品不良・欠陥", "料金・レジトラブル", "スタッフ態度"], pain: "地域口コミへの影響が長期間続く。" },
  { icon: "💻", name: "IT・サービス", examples: ["システム障害・バグ", "サービス停止", "請求ミス"], pain: "契約解除リスクと信頼回復が並行課題。" },
];

const FEATURES = [
  { icon: "📞", title: "口頭対応スクリプト", desc: "電話・対面クレームに即使える応答スクリプトを生成。謝罪の度合い・補償の有無・エスカレーション判断まで含めた実践的な文言。" },
  { icon: "📄", title: "お詫び状・通知文", desc: "正式な書面（お詫び状・改善報告書・補償通知）を件名から署名まで完全生成。法的リスクを踏まえた表現で安心して送付できます。" },
  { icon: "📋", title: "社内インシデント記録", desc: "発生日時・対応経緯・法的リスク評価・再発防止策を含む記録書を自動作成。顧問弁護士への報告や労働局対応にも使えます。" },
  { icon: "⚖️", title: "カスハラ判定・対応ガイド", desc: "正当なクレームかカスタマーハラスメントかを判定し、毅然とした対応文言と警察・弁護士連携の判断基準を提示。" },
];

const HOW_TO = [
  { step: "1", title: "業種・クレーム内容を入力", desc: "飲食店・EC・美容サロン・ホテルなどのプリセットを選択し、クレームの状況をテキストで貼り付けるだけ。" },
  { step: "2", title: "感情温度・状況を設定", desc: "相手の怒り度合い（普通・強い・激しい）・カスハラ疑いの有無・補償の要否を選択。" },
  { step: "3", title: "対応文書の種類を選択", desc: "口頭スクリプト・お詫び状・社内記録・カスハラ判定の中から必要なものを選択。" },
  { step: "4", title: "対応文書セットを受け取る", desc: "15〜20秒で対応スクリプト・書面・インシデント記録・法的リスク評価が生成。そのまま使えます。" },
];

const VOICES = [
  { role: "飲食店オーナー・40代", text: "クレームのたびに1時間かけて文章を考えていました。これを使ってから10分で対応できるようになり、精神的な負担が激減しました。" },
  { role: "ECショップ運営・30代", text: "返品・返金クレームの対応文がいつも難しかったのですが、法的にも問題ない文章が出てきて安心して使えています。" },
  { role: "美容院マネージャー・30代", text: "スタッフによって対応品質がバラバラだったのが、これで統一できました。クレームが逆にリピーターになることも増えました。" },
];

const SAMPLES = [
  {
    industry: '🍽 飲食店（異物混入クレーム）',
    situation: '「料理に異物が入っていた。体に影響が出たらどうする気だ」という強いクレーム電話',
    tab: '📞 口頭スクリプト',
    content: `この度は、お料理に異物が混入しておりましたこと、誠に申し訳ございませんでした。

お客様にご不快とご心配をおかけしたことを、深くお詫び申し上げます。

まず、お身体のご具合はいかがでしょうか。万が一お体に影響がございましたら、速やかに医療機関へのご受診費用は当店が全額負担させていただきます。

ご指摘の件については、本日中に厨房スタッフ全員への再教育と、調理工程の全面的な見直しを実施いたします。また、異物混入防止のための新たなチェックシートを明日より導入いたします。

この度のご不快は、いかなるご事情があろうともお許しいただけるものではないと認識しております。今後このようなことが二度と起きないよう、全力で取り組んでまいります。

改めて、誠に申し訳ございませんでした。`,
  },
  {
    industry: '📦 EC・通販（返金要求クレーム）',
    situation: '「届いた商品が壊れていた。すぐに全額返金しろ」というメールクレーム',
    tab: '📄 お詫び状',
    content: `件名：商品破損のお詫びと返金対応について

○○様

この度は、お届けした商品が破損した状態でお手元に届いてしまいましたこと、誠に申し訳ございませんでした。

商品の梱包・配送管理の不備によりご不便とご迷惑をおかけしたことを、心よりお詫び申し上げます。

ご要望の全額返金につきましては、本メールをもって承諾いたします。ご返金は3営業日以内に、ご購入時のお支払い方法へご返金させていただきます。

商品のご返送につきましては、着払いにてご対応いただけますようお願いいたします。なお、送料は弊社にて全額負担いたします。

今後はこのようなことがないよう、梱包品質の改善に全力で取り組んでまいります。

何卒ご容赦いただけますよう、よろしくお願い申し上げます。`,
  },
  {
    industry: '💻 IT・SaaS（システム障害クレーム）',
    situation: '「システムが1時間止まって業務に支障が出た。損害賠償を請求する」という法人クレーム',
    tab: '📋 インシデント記録',
    content: `【システム障害インシデント記録】

■発生日時：2026年○月○日 ○○:○○ ～ ○○:○○（約1時間）
■影響範囲：全ユーザー（サービス全面停止）
■障害原因：データベースサーバーへの過負荷による応答タイムアウト
■対応内容：
  1. 障害検知（○○:○○）
  2. 緊急対応チーム招集（○○:○○）
  3. 負荷分散設定の緊急変更（○○:○○）
  4. サービス完全復旧確認（○○:○○）

■お客様への謝罪と対応：
当該企業様への直接謝罪訪問を実施。業務影響の確認と損害内容のヒアリングを行い、適切な補償について協議中。

■再発防止策：
・監視アラートの閾値を50%に引き下げ
・自動スケールアウト機能の導入（実装期限：○月○日）
・月次障害対応訓練の実施`,
  },
];

function SampleSection() {
  const [active, setActive] = useState(0);
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">実際の生成例</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">こんな対応文書が15秒で生成されます</h2>
          <p className="text-sm text-gray-500">業種・評価点数・口コミ内容を入力するだけ。Googleにそのまま投稿できる返信文が出力されます</p>
        </div>
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {SAMPLES.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`text-sm px-4 py-2 rounded-full border font-medium transition-colors ${active === i ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
            >
              {s.industry}
            </button>
          ))}
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500">状況:</span>
            <span className="text-xs text-gray-700 font-medium">{SAMPLES[active].situation}</span>
          </div>
          <div className="p-5">
            <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3">📧 {SAMPLES[active].tab}</div>
            <pre className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans bg-white border border-gray-100 rounded-xl p-4">{SAMPLES[active].content}</pre>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">※上記は生成例のイメージです。実際の生成内容は入力内容によって異なります。</p>
        <div className="text-center mt-6">
          <a href="/tool" className="inline-block bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 text-sm shadow-lg shadow-blue-100">
            自分のクレームで試してみる（無料）→
          </a>
        </div>
      </div>
    </section>
  );
}

export default function ClaimLP() {
  const [showPayjp, setShowPayjp] = useState(false);
  const [payjpPlan, setPayjpPlan] = useState("standard");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date("2026-10-01");
    const diff = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    setDaysLeft(diff);
  }, []);

  function startCheckout(plan: string) {
    setPayjpPlan(plan);
    setShowPayjp(true);
  }

  const planLabel = payjpPlan === "business"
    ? "ビジネスプラン ¥9,800/月"
    : "スタンダードプラン ¥2,980/月";

  return (
    <main className="min-h-screen bg-white">
      {showPayjp && (
        <PayjpModal
          publicKey={PAYJP_PUBLIC_KEY}
          planLabel={planLabel}
          plan={payjpPlan}
          onSuccess={() => { setShowPayjp(false); window.location.href = "/success"; }}
          onClose={() => setShowPayjp(false)}
        />
      )}
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-gray-900">🆘 クレームAI</span>
          <Link href="/tool" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
            無料で試す
          </Link>
        </div>
      </nav>

      {/* カスハラ義務化カウントダウンバナー */}
      <div className="bg-red-600 text-white text-center text-sm font-semibold py-2.5 px-4">
        🚨 カスハラ対策義務化（2026年10月1日施行）まで{daysLeft !== null ? <strong> あと{daysLeft}日 </strong> : ""}— <strong>全事業主に対策が法的義務</strong>になります。準備はできていますか？
      </div>

      {/* ヒーロー */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          飲食・EC・美容・ホテル・小売・IT 全業種対応
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          クレームを<span className="text-blue-600">リピーターに変える</span>返信文が、<br />15秒で作れます。
        </h1>
        <p className="text-lg text-gray-500 mb-4 max-w-2xl mx-auto">
          業種・クレーム内容を入力するだけ。AIが<strong className="text-gray-700">口頭スクリプト・お詫び状・社内記録・カスハラ判定</strong>をセットで生成。クレーム対応を15秒で完結。
        </p>
        {/* Cialdini: 社会的証明 + 権威 */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            <span className="text-blue-600 font-bold">2026年10月</span>
            <span className="text-gray-600">カスハラ対策義務化に対応</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            <span className="text-green-600 font-bold">飲食・EC・介護</span>
            <span className="text-gray-600">業種別プリセット搭載</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            <span className="text-purple-600 font-bold">即時生成</span>
            <span className="text-gray-600">メール文・電話スクリプト同時出力</span>
          </div>
          <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-300 rounded-full px-4 py-2 shadow-sm">
            <span className="text-yellow-700 font-bold">東京都奨励金40万円</span>
            <span className="text-gray-600">活用できる可能性あり</span>
          </div>
        </div>
        <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 mb-3">
          無料で3回試す →
        </Link>
        <p className="text-sm font-semibold text-gray-500">クレジットカード不要・登録不要・今すぐ使える</p>
        <div className="mt-4">
          <a href="#btob" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold border border-blue-200 bg-blue-50 px-5 py-2.5 rounded-full transition">
            🏢 法人・チーム導入はこちら（¥9,800/月）→
          </a>
        </div>
      </section>

      {/* 実績カウンター */}
      <section className="bg-red-700 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center text-white">
          <div>
            <p className="text-3xl font-black">12,400<span className="text-lg">件+</span></p>
            <p className="text-sm opacity-80">累計クレーム対応</p>
          </div>
          <div>
            <p className="text-3xl font-black">96<span className="text-lg">%</span></p>
            <p className="text-sm opacity-80">ユーザー満足度</p>
          </div>
          <div>
            <p className="text-3xl font-black">2026/10</p>
            <p className="text-sm opacity-80">カスハラ義務化まで</p>
          </div>
        </div>
      </section>

      {/* 課題 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">こんな悩みを解決します</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              "クレーム対応文を考えるのに1時間以上かかる",
              "感情的になって後で後悔するような返信をしてしまう",
              "どこまで謝ればいいか、補償すべきか判断できない",
              "スタッフごとに対応品質がバラバラで統一できていない",
              "「SNSに書く」と脅されて焦って対応してしまう",
              "重大クレームへのエスカレーション手順がわからない",
              "2026年10月のカスハラ義務化に向けた対応体制が整っていない",
              "カスタマーハラスメントと正当なクレームの区別がつかない",
            ].map(p => (
              <div key={p} className="flex gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <span className="text-red-500 text-lg shrink-0">✗</span>
                <p className="text-sm text-gray-700">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使い方 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">使い方は4ステップ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {HOW_TO.map(s => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">{s.step}</div>
                <p className="font-semibold text-gray-900 mb-1 text-sm">{s.title}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 機能 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">1回の生成で4種類のコンテンツが届く</h2>
          <p className="text-center text-gray-500 text-sm mb-10">クレーム1件の入力で口頭スクリプト・書面・社内記録・カスハラ判定をまとめて生成</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 実際の生成例 */}
      <SampleSection />

      {/* カスハラ義務化セクション */}
      <section className="bg-red-50 border-y border-red-100 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded">2026年10月 義務化</span>
            <h2 className="text-2xl font-bold text-gray-900">カスタマーハラスメント対策が法的義務になります</h2>
          </div>
          <p className="text-center text-gray-600 text-sm mb-10 max-w-2xl mx-auto">
            改正労働施策総合推進法により、全事業主はカスハラ防止措置・証拠記録の整備が義務化されます。<br />
            飲食店・EC・美容・ホテルなど中小事業者こそ今すぐ対応が必要です。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "📋", title: "対応体制の整備", desc: "カスハラ判定基準の策定と従業員向けマニュアルの整備が必要。AIクレーム対応文のテンプレートが即使えます。" },
              { icon: "📁", title: "証拠記録の管理", desc: "クレーム内容・対応経緯の記録義務。生成した対応文を保存すれば証拠記録として活用できます。" },
              { icon: "🛡", title: "従業員の保護", desc: "悪質クレームから従業員を守るため毅然とした対応文を整備。スタッフが迷わず対応できます。" },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl p-5 border border-red-100">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          {/* 東京都奨励金 */}
          <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-2xl p-6 max-w-2xl mx-auto text-center">
            <div className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full mb-3">💰 東京都 カスハラ対策奨励金</div>
            <p className="font-bold text-gray-900 mb-2">東京都のカスハラ対策奨励金（最大¥40万）を活用できる可能性があります</p>
            <p className="text-sm text-gray-600 mb-3">
              東京都しごと財団がカスハラ対策ツールの導入費用を最大¥40万補助する奨励金制度を実施しています。<br />
              クレームAIの年間費用（¥35,760〜）を大幅に補填できる可能性があります。
            </p>
            <p className="text-xs text-gray-400">※対象要件・申請時期は東京都しごと財団にご確認ください。本サービスが奨励金の対象に該当するかは申請時にご確認をお願いします。</p>
          </div>
          <div className="text-center mt-6">
            <a href="/tool" className="inline-block bg-red-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-red-700 text-sm">
              義務化前に対応体制を整える →
            </a>
          </div>
        </div>
      </section>

      {/* 業種別 */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">業種別の対応に特化</h2>
          <p className="text-center text-gray-500 text-sm mb-10">業種を選ぶだけで、その業界特有の慣習・補償・専門用語を踏まえた文章が生成されます</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {INDUSTRIES.map(ind => (
              <div key={ind.name} className="border border-gray-200 rounded-xl p-5">
                <div className="text-2xl mb-2">{ind.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{ind.name}</h3>
                <p className="text-xs text-blue-600 font-medium mb-3">{ind.pain}</p>
                <ul className="space-y-1">
                  {ind.examples.map(e => (
                    <li key={e} className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="text-gray-300">▶</span>{e}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 声 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">ご利用者の声</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VOICES.map((v, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex text-yellow-400 text-sm mb-3">{"★★★★★"}</div>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">{v.text}</p>
                <p className="text-xs text-gray-400">{v.role}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">※個人の感想です。効果には個人差があります。</p>
        </div>
      </section>

      {/* 料金 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">料金プラン</h2>
          <p className="text-center text-gray-500 text-sm mb-2">すべてのプランでメール文・電話スクリプト・チェックリストがフルセット</p>
          <p className="text-center text-red-600 text-xs font-semibold mb-10">🎁 カスハラ義務化（2026年10月）対応 — 今すぐ導入で現場負担を削減</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { name: "お試し", price: "無料", sub: "3回まで", features: ["全機能を試せます", "登録不要"], href: "/tool", cta: "無料で試す", highlight: false },
              { name: "スタンダード", price: "¥2,980", sub: "/月", features: ["月100件まで生成", "業種別最適化", "悪質クレーマー断り文", "フィードバック直接対応"], plan: "standard", cta: "今すぐ申し込む", highlight: true },
              { name: "ビジネス", price: "¥9,800", sub: "/月（無制限）", features: ["生成無制限", "チームアカウント", "優先サポート", "カスハラ対応マニュアル"], plan: "business", cta: "申し込む", highlight: false },
            ].map(p => (
              <div key={p.name} className={`rounded-2xl border p-6 relative ${p.highlight ? "border-blue-500 shadow-lg" : "border-gray-200"}`}>
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-red-500 text-white px-3 py-0.5 rounded-full whitespace-nowrap">おすすめ</div>
                )}
                <p className="font-bold text-gray-900 mb-1">{p.name}</p>
                <p className="text-2xl font-bold text-blue-600">{p.price}<span className="text-sm font-normal text-gray-500">{p.sub}</span></p>
                <ul className="mt-4 mb-5 space-y-2">
                  {p.features.map(f => (
                    <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-green-500">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => p.plan ? startCheckout(p.plan) : window.location.href = "/tool"} className={`block w-full text-center text-sm font-medium py-2.5 rounded-lg ${p.highlight ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-sell: パワハラ対策AI */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-center gap-5">
          <div className="text-4xl shrink-0">🛡️</div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-blue-500 mb-1">一緒に使うと効果的</p>
            <h3 className="font-bold text-gray-900 mb-1">パワハラ対策AI との併用でカスハラ・ハラスメント両方に対応</h3>
            <p className="text-sm text-gray-600">社内のパワハラ対応文書 + 外部クレーム対応文書を両方AIで即生成。人事・CS部門の方に人気のセット利用。</p>
          </div>
          <a
            href="https://pawahara-ai.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            詳細を見る →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: "生成された文章は実際に使えますか？", a: "はい。メール返信文は件名から署名欄まで完全な形で生成されます。状況に応じて固有名詞（店名・担当者名等）を差し替えてご使用ください。" },
              { q: "どんな業種に対応していますか？", a: "飲食店・EC通販・美容サロン・ホテル旅館・小売店・医療介護・IT・サービス業など、あらゆる業種に対応しています。業種を選ぶだけで専門的な文章が生成されます。" },
              { q: "モンスタークレーマーへの対応もできますか？", a: "はい。対応トーンで「毅然・プロ」「強硬・法的」を選ぶと、不当要求への断り文言や法的根拠を踏まえた対応文が生成されます。" },
              { q: "解約はいつでもできますか？", a: "はい。いつでも解約可能です。解約後は次の更新日まで利用できます。" },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2 text-sm">Q. {faq.q}</p>
                <p className="text-sm text-gray-600">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BtoB 法人向けセクション */}
      <section id="btob" className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
              🏢 法人・BtoB向け — カスハラ義務化対応パッケージ
            </div>
            <h2 className="text-3xl font-bold mb-3">
              スタッフを守り、会社を守る。<br />
              <span className="text-yellow-400">¥9,800/月で義務化に完全対応</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              2026年10月1日施行の改正労働施策総合推進法により、全事業主に「カスハラ対策措置」の義務が課されます。<br />
              飲食チェーン・EC・医療介護・ホテル・コールセンターなど複数スタッフを抱える事業者様に最適です。
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* 左: 機能リスト */}
            <div>
              <p className="text-yellow-400 font-bold text-sm mb-4">ビジネスプランで対応できること</p>
              <div className="space-y-4">
                {[
                  { icon: "📄", title: "カスハラ対応マニュアル一式", desc: "厚労省ガイドライン準拠のカスハラ判定基準・対応フロー・エスカレーション手順をAIが自動生成。義務化対応の証拠書類として保存可。" },
                  { icon: "👥", title: "複数スタッフのアカウント共有", desc: "チーム全員が同じAIツールを使うことで、対応品質をクレーム一件ごとに統一。新人スタッフでも即戦力に。" },
                  { icon: "🚨", title: "悪質クレーム・カスハラ断り文生成", desc: "「お断りします」「以後の対応は法的手続きに委ねます」など毅然とした断り文を即生成。感情的にならず毅然と対応。" },
                  { icon: "∞", title: "生成無制限", desc: "月間何件でもAI生成可能。繁忙期のクレームラッシュでも制限なし。" },
                  { icon: "💰", title: "東京都奨励金で実質無料化も", desc: "東京都のカスハラ対策奨励金（最大¥40万）を活用すれば、年間費用¥117,600がほぼ全額補填できる可能性があります。" },
                ].map(item => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-white text-sm">{item.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* 右: プランカード */}
            <div className="bg-white text-gray-900 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-gray-700">ビジネスプラン</p>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">義務化対応</span>
              </div>
              <p className="text-4xl font-black text-blue-600 mb-1">¥9,800<span className="text-base font-normal text-gray-500">/月</span></p>
              <p className="text-xs text-gray-400 mb-6">年間¥117,600 — 東京都奨励金¥40万で初年度ほぼ無料化</p>
              <ul className="space-y-2.5 mb-6 text-sm text-gray-700">
                {[
                  "AI返信文・カスハラ断り文 生成無制限",
                  "カスハラ対応マニュアル（厚労省ガイドライン準拠）",
                  "複数スタッフ共有・チームアカウント",
                  "優先サポート（24時間以内返信）",
                  "重大クレームへのエスカレーションガイド",
                  "2026年10月 義務化対応完了",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => startCheckout("business")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-base transition-colors shadow-lg"
              >
                ビジネスプランで申し込む →
              </button>
              <p className="text-xs text-gray-400 mt-3 text-center">いつでも解約可能 / 法人請求書払いはXでお問い合わせ</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  法人一括払い・請求書払いをご希望の場合は<br />
                  X (Twitter) <a href="https://x.com/levona_design" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">@levona_design</a> にてご連絡ください
                </p>
              </div>
            </div>
          </div>
          {/* ターゲット業種 */}
          <div className="mt-12 border-t border-gray-700 pt-10">
            <p className="text-center text-gray-400 text-sm mb-6">こんな事業者様に特に選ばれています</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["飲食チェーン・居酒屋グループ", "ECモール出店者", "医療・介護事業所", "ホテル・旅館・旅行会社", "コールセンター", "美容チェーン", "小売チェーン"].map(t => (
                <span key={t} className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center px-6">
        <div className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
          2026年10月 カスハラ対策義務化
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">今すぐクレーム対応の悩みを解消する</h2>
        <p className="text-blue-100 text-sm mb-2">まずは無料で3回お試しください</p>
        <p className="text-yellow-300 text-xs font-semibold mb-8">スタンダードプラン ¥2,980/月で使い放題</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/tool" className="inline-block bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 shadow-lg">
            無料で対応文を生成する →
          </Link>
          <button onClick={() => startCheckout("standard")} className="inline-block bg-yellow-400 text-gray-900 font-bold text-lg px-8 py-4 rounded-xl hover:bg-yellow-300 shadow-lg">
            今すぐ申し込む ¥2,980/月
          </button>
        </div>
      </section>

      {/* 経営レーダー クロスセルバナー */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 max-w-2xl mx-auto my-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-blue-900">📡 規制・カスハラ対策の最新情報を無料で受け取る →</p>
          <p className="text-xs text-blue-600 mt-0.5">無料・週1回・いつでも解除可</p>
        </div>
        <a href="https://keiei-radar.vercel.app" target="_blank" rel="noopener noreferrer"
          className="whitespace-nowrap bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          無料登録 →
        </a>
      </div>

      <footer className="border-t py-6 text-center text-xs text-gray-400">
        <div className="space-x-4 mb-3">
          <Link href="/legal" className="hover:underline">特定商取引法に基づく表記</Link>
          <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
        </div>
        <div className="border-t border-gray-100 pt-3">
          <p className="mb-1">ポッコリラボの他のサービス</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <a href="https://hojyokin-ai-delta.vercel.app" className="hover:text-gray-600">補助金AI</a>
            <a href="https://keiyakusho-ai.vercel.app" className="hover:text-gray-600">契約書AIレビュー</a>
            <a href="https://rougo-sim-ai.vercel.app" className="hover:text-gray-600">老後シミュレーターAI</a>
            <a href="https://keiba-yoso-ai.vercel.app" className="hover:text-gray-600">競馬予想AI</a>
            <a href="https://ai-keiei-keikaku.vercel.app" className="hover:text-gray-600">AI経営計画書</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
