"use client";
import Link from "next/link";
import { useState } from "react";
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
  { icon: "📧", title: "メール返信文", desc: "件名・宛名から署名まで完全な文章をそのままコピペ可能。業種・深刻度・トーンに合わせて自動調整。" },
  { icon: "📞", title: "電話対応スクリプト", desc: "第一声からクロージングまで。「SNSに投稿する」「慰謝料を要求する」など難しい場面への切り返しフレーズも収録。" },
  { icon: "✅", title: "初動対応チェックリスト", desc: "発生から1時間以内・当日中・3日以内のアクションを段階別に整理。対応漏れを防ぎます。" },
  { icon: "💡", title: "顧客満足に変えるアドバイス", desc: "クレームをリピーター獲得のチャンスに変える具体的な提案。なぜ効果があるかの理由付きで解説。" },
];

const HOW_TO = [
  { step: "1", title: "業種・状況を選択", desc: "プリセットをタップするだけ。直接入力もできます。" },
  { step: "2", title: "クレーム内容を入力", desc: "受けたクレームの内容を入力。詳しく書くほど精度が上がります。" },
  { step: "3", title: "深刻度・トーンを設定", desc: "軽微〜重大、丁寧〜強硬の中から状況に合わせて選択。" },
  { step: "4", title: "対応文セットを受け取る", desc: "15〜20秒でメール文・電話スクリプト・チェックリストがセットで生成されます。" },
];

const VOICES = [
  { role: "飲食店オーナー・40代", text: "クレームのたびに1時間かけて文章を考えていました。これを使ってから10分で対応できるようになり、精神的な負担が激減しました。" },
  { role: "ECショップ運営・30代", text: "返品・返金クレームの対応文がいつも難しかったのですが、法的にも問題ない文章が出てきて安心して使えています。" },
  { role: "美容院マネージャー・30代", text: "スタッフによって対応品質がバラバラだったのが、これで統一できました。クレームが逆にリピーターになることも増えました。" },
];

export default function ClaimLP() {
  const [showPayjp, setShowPayjp] = useState(false);
  const [payjpPlan, setPayjpPlan] = useState("standard");

  function startCheckout(plan: string) {
    setPayjpPlan(plan);
    setShowPayjp(true);
  }

  const planLabel = payjpPlan === "business"
    ? "ビジネスプラン ¥9,800/月"
    : "スタンダードプラン ¥4,980/月";

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
          <span className="font-bold text-gray-900">AIクレーム対応文</span>
          <Link href="/tool" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
            無料で試す
          </Link>
        </div>
      </nav>

      {/* カスハラ義務化バナー */}
      <div className="bg-red-600 text-white text-center text-sm font-semibold py-2.5 px-4">
        🚨 2026年10月から<strong>カスタマーハラスメント対策が全事業主に法的義務化</strong>されます。準備はできていますか？
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
          業種・深刻度・トーンを選ぶだけ。AIが<strong className="text-gray-700">メール返信文・電話スクリプト・対応チェックリスト</strong>をセットで生成。クレーム対応のストレスをゼロに。
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
        </div>
        <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 mb-3">
          無料で3回試す →
        </Link>
        <p className="text-sm font-semibold text-gray-500">クレジットカード不要・登録不要・今すぐ使える</p>
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
          <h2 className="text-2xl font-bold text-center mb-3">生成される対応文セット</h2>
          <p className="text-center text-gray-500 text-sm mb-10">1回の生成で4種類のコンテンツが出力されます</p>
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
          <div className="text-center mt-8">
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
        </div>
      </section>

      {/* 料金 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-3">料金プラン</h2>
          <p className="text-center text-gray-500 text-sm mb-10">すべてのプランでメール文・電話スクリプト・チェックリストがフルセット</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { name: "お試し", price: "無料", sub: "3回まで", features: ["全機能を試せます", "登録不要"], href: "/tool", cta: "無料で試す", highlight: false },
              { name: "スタンダード", price: "¥4,980", sub: "/月（月100件）", features: ["月100件まで生成", "業種別最適化", "悪質クレーマー断り文", "履歴保存（10件）"], plan: "standard", cta: "今すぐ申し込む", highlight: true },
              { name: "ビジネス", price: "¥9,800", sub: "/月（無制限）", features: ["生成無制限", "チームアカウント", "優先サポート", "カスハラ対応マニュアル"], plan: "business", cta: "申し込む", highlight: false },
            ].map(p => (
              <div key={p.name} className={`rounded-2xl border p-6 relative ${p.highlight ? "border-blue-500 shadow-lg" : "border-gray-200"}`}>
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-blue-600 text-white px-3 py-0.5 rounded-full whitespace-nowrap">一番人気</div>
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
                <button onClick={() => startCheckout(p.plan)} className={`block w-full text-center text-sm font-medium py-2.5 rounded-lg ${p.highlight ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
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

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center px-6">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
          2026年10月カスハラ義務化まで対応急ぎ
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">今すぐクレーム対応の悩みを解消する</h2>
        <p className="text-blue-100 text-sm mb-8">登録不要・クレジットカード不要で3回無料</p>
        <Link href="/tool" className="inline-block bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 shadow-lg">
          無料で対応文を生成する →
        </Link>
      </section>

      <footer className="border-t py-6 text-center text-xs text-gray-400 space-x-4">
        <Link href="/legal" className="hover:underline">特定商取引法に基づく表記</Link>
        <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
      </footer>
    </main>
  );
}
