import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "カスタマーハラスメント対応マニュアル｜飲食店・EC・ホテル向け例文集【2026年義務化対応】",
  description: "2026年10月1日施行のカスハラ対策義務化（改正労働施策総合推進法）に完全対応。飲食店・EC・ホテル業種向けのカスタマーハラスメント対応例文集と初期対応マニュアルを無料公開。AIで15秒自動生成も可能。",
  openGraph: {
    title: "カスタマーハラスメント対応マニュアル｜飲食店・EC・ホテル向け例文集【2026年義務化】",
    description: "2026年10月1日施行のカスハラ義務化に対応した対応例文集と初期対応マニュアル。AIで15秒自動生成。",
    locale: "ja_JP",
    type: "article",
  },
};

const examples = [
  {
    category: "飲食店",
    icon: "🍽️",
    cases: [
      {
        situation: "「料理が遅い」と怒鳴り続けるお客様",
        bad: "本当に申し訳ございません、すぐにお持ちします（ひたすら謝り続ける）",
        good: `お待たせして大変申し訳ございません。現在、ご注文から○分が経過しております。厨房に確認いたしますので、少々お待ちくださいませ。もし著しくお待たせする場合は、改めてご案内いたします。`,
        point: "謝罪しつつも、具体的な対応ステップを示す。感情的な怒鳴り声には冷静な事実確認で対応。",
      },
      {
        situation: "「SNSに拡散する」と脅すお客様",
        bad: "わかりました、何でもいたします（過剰な約束をしてしまう）",
        good: `ご不満はしっかり受け止めます。当店の対応に問題があった点は改善いたします。ただ、SNSへの投稿はお客様ご自身のご判断となります。当店としては、正当なご意見には真摯に対応いたしますが、事実と異なる内容については法的対応を検討する場合がございます。`,
        point: "脅しには毅然と対応。「法的対応を検討」の一言で抑止効果あり。",
      },
    ],
  },
  {
    category: "EC・通販",
    icon: "📦",
    cases: [
      {
        situation: "「すぐ返金しないと訴える」と言うお客様",
        bad: "わかりました、すぐに全額返金します（確認なしで約束する）",
        good: `ご不便をおかけして誠に申し訳ございません。返金につきましては、商品の状態確認と弊社規約に基づき対応いたします。まず、商品の写真と注文番号をお知らせください。確認次第、○営業日以内にご回答いたします。`,
        point: "返金は手順通りに。「規約に基づき」の言葉で無制限な要求を牽制。",
      },
      {
        situation: "繰り返し同じ苦情の電話をかけてくるお客様",
        bad: "（何度も電話を受け続ける）",
        good: `先日来、同じ件でご連絡いただいており、誠意を持って対応してまいりました。当社の最終回答は○月○日にお伝えした通りです。これ以上の対応は困難な状況です。ご不満の場合は、消費者センター（188）にご相談いただけますでしょうか。`,
        point: "「最終回答」を明示し、第三者機関への誘導で過剰な接触を終了させる。",
      },
    ],
  },
  {
    category: "ホテル・宿泊",
    icon: "🏨",
    cases: [
      {
        situation: "「部屋を無料にしろ」と要求するお客様",
        bad: "（無料にしてしまう）",
        good: `ご不便をおかけして大変申し訳ございません。ご不満の内容を詳しくお聞かせください。対応可能な範囲でご満足いただけるよう努めます。ただ、全額免除のご対応は当ホテルの規定上、難しい状況です。ポイント付与やアップグレードなど、別の形でのお詫びは検討いたします。`,
        point: "「規定上難しい」と伝え、代替案を提示。不当な要求には明確に「No」。",
      },
    ],
  },
];

const steps = [
  {
    step: "01",
    title: "録音・記録を残す",
    desc: "電話対応は録音、対面は複数スタッフで対応。「記録のため確認させてください」と伝えるだけで抑止効果あり。",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-orange-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm6.364 9.636a.75.75 0 0 1 .75.75 7 7 0 0 1-13.228 3.223A7 7 0 0 1 4.886 11.386a.75.75 0 0 1 1.5 0 5.5 5.5 0 0 0 11 0 .75.75 0 0 1 .75-.75h.228zM12 18.5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 12 18.5z"/>
      </svg>
    ),
  },
  {
    step: "02",
    title: "感情ではなく事実で対応",
    desc: "「何が問題か」「どう対応できるか」を冷静に確認。謝罪の連発は過失を認めることになるため注意。",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-orange-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1h2a1 1 0 0 1 1 1v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h2V4zm6 1V4H10v1h4zM7 7v12h10V7H7zm2 3h6v1H9v-1zm0 3h6v1H9v-1zm0 3h4v1H9v-1z"/>
      </svg>
    ),
  },
  {
    step: "03",
    title: "「できること」と「できないこと」を明確に",
    desc: "規約・法律・会社方針に基づき、対応できる範囲を明示。不当要求には「規定上対応できません」と伝える。",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-orange-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2l1.5 4.5H18l-3.75 2.75 1.5 4.5L12 11l-3.75 2.75 1.5-4.5L6 6.5h4.5L12 2zm-7 14h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm2 3h10a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2z"/>
      </svg>
    ),
  },
  {
    step: "04",
    title: "エスカレーション基準を設ける",
    desc: "暴言・脅迫・長時間拘束が発生したら上長対応または退去要請へ。スタッフ1人に任せない体制を作る。",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-orange-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1-1.06 1.06L13 5.06V19a.75.75 0 0 1-1.5 0V5.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06l6-6z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    step: "05",
    title: "最終回答を明示して終了",
    desc: "「これが弊社の最終回答です」と伝え、それ以上の対応は困難と明示。第三者機関（消費者センター）を案内。",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-orange-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.9-1.9a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.14-.094l3.776-5.224z" clipRule="evenodd"/>
      </svg>
    ),
  },
];

export default function KasuharaGuidePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-orange-400 font-bold text-sm hover:text-orange-300">
            ← クレームAI トップ
          </Link>
          <span className="text-gray-500 text-xs">カスハラ対応マニュアル</span>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-amber-900 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-6">
            <svg className="inline-block w-3.5 h-3.5 mr-1 align-text-bottom" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/></svg>
            2025年4月施行：カスタマーハラスメント対策法 完全対応
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            カスタマーハラスメント<br />
            <span className="text-orange-400">対応マニュアル・例文集</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-6">
            飲食店・EC通販・ホテル業種向け。カスハラ対策法施行に伴う<strong className="text-white">対応マニュアル整備を無料でサポート。</strong>
            AIを使えば個別状況に合わせた対応文を30秒で自動生成できます。
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-400">
            <span>✓ 飲食店向け例文</span>
            <span>✓ EC/通販向け例文</span>
            <span>✓ ホテル向け例文</span>
            <span>✓ 5ステップ初期対応手順</span>
          </div>
        </div>
      </section>

      {/* What is カスハラ法 */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">カスタマーハラスメント対策法とは</h2>
          <div className="bg-amber-900/30 border border-amber-700 rounded-2xl p-6 mb-8">
            <p className="text-amber-200 font-bold mb-2">⚠️ 2025年4月施行</p>
            <p className="text-gray-200 leading-relaxed">
              2025年4月より施行された「改正労働施策総合推進法（カスハラ対策法）」により、<strong className="text-white">企業はカスタマーハラスメントから従業員を守る措置を講じる義務</strong>が生じました。
              具体的には「相談窓口の設置」「対応マニュアルの策定」「研修の実施」などが求められます。
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "カスハラの定義", desc: "正当なクレームの範囲を超えた要求や行為。暴言・脅迫・長時間拘束・SNS拡散の脅しなど。" },
              { title: "企業に求められること", desc: "相談窓口設置・対応マニュアル策定・従業員への研修・記録保存体制の整備。" },
              { title: "対応しなかった場合", desc: "従業員からの訴訟リスク、監督官庁からの指導、風評被害のリスクが生じる。" },
            ].map((item) => (
              <div key={item.title} className="bg-gray-800 rounded-xl p-5">
                <h3 className="font-bold text-orange-300 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-step Manual */}
      <section className="py-16 px-4 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center">カスハラ初期対応 5ステップ</h2>
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.step} className="flex gap-6 bg-gray-900 rounded-2xl p-6">
                <div className="shrink-0 flex items-start">{s.icon}</div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-orange-500 text-black text-xs font-black px-2 py-0.5 rounded">STEP {s.step}</span>
                    <h3 className="font-bold text-white">{s.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples by Industry */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">業種別 カスハラ対応例文集</h2>
          <p className="text-gray-400 text-center mb-12">実際のカスハラ事例と、NG対応・OK対応の対比で解説。</p>
          {examples.map((cat) => (
            <div key={cat.category} className="mb-16">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-orange-300">{cat.category}業種</span>
              </h3>
              <div className="space-y-8">
                {cat.cases.map((c, i) => (
                  <div key={i} className="bg-gray-800 rounded-2xl p-6">
                    <div className="bg-gray-700 rounded-lg px-4 py-2 mb-5">
                      <span className="text-gray-300 text-sm font-bold">状況: </span>
                      <span className="text-white text-sm">{c.situation}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-red-900/40 border border-red-700 rounded-xl p-4">
                        <div className="text-red-400 text-xs font-bold mb-2">❌ NG対応</div>
                        <p className="text-gray-300 text-sm">{c.bad}</p>
                      </div>
                      <div className="bg-green-900/40 border border-green-700 rounded-xl p-4">
                        <div className="text-green-400 text-xs font-bold mb-2">✅ OK対応（例文）</div>
                        <p className="text-gray-200 text-sm whitespace-pre-wrap">{c.good}</p>
                      </div>
                    </div>
                    <div className="bg-blue-900/30 rounded-lg px-4 py-2">
                      <span className="text-blue-300 text-xs font-bold">ポイント: </span>
                      <span className="text-gray-300 text-xs">{c.point}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Tool CTA */}
      <section className="py-20 px-4 bg-gray-950 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">個別状況に合わせた対応文を30秒で生成</h2>
          <p className="text-gray-400 mb-8">
            上記は汎用例文ですが、実際のクレームは状況が複雑です。<br />
            クレームAIに状況を入力すると、<strong className="text-white">お詫び文・原因説明・再発防止策を自動生成。</strong>
            まず3回無料でお試しください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tool"
              className="bg-orange-500 hover:bg-orange-400 text-black font-black text-lg px-10 py-4 rounded-xl transition"
            >
              無料で試す（3回）→
            </Link>
            <Link
              href="/business"
              className="border border-orange-600 text-orange-300 hover:text-white font-semibold text-lg px-10 py-4 rounded-xl transition"
            >
              法人プランを見る
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-4">登録不要・クレジットカード不要で3回試せる</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 text-center text-gray-500 text-xs">
        <p>© 2026 クレームAI</p>
        <p className="mt-2">
          <Link href="/legal" className="hover:text-gray-300 underline">特定商取引法に基づく表記</Link>
        </p>
      </footer>
    </main>
  );
}
