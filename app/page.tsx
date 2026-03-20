"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import KomojuButton from "@/components/KomojuButton";

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

const CASE_STUDIES = [
  {
    industry: "飲食チェーン（5店舗）",
    icon: "🍽",
    problem: "月12件のクレーム対応に1件あたり平均65分かかっており、店長の精神的負担が限界に。SNS拡散を恐れて過度な謝罪・補償をしてしまうケースが頻発。",
    solution: "クレームAI導入後、プリセット選択+状況入力だけで口頭スクリプト・書面・記録の3種を即出力。カスハラ判定機能で「正当クレーム/不当要求」を判別し、毅然とした対応が可能に。",
    result: "対応時間65分→12分（81%削減）。過度な補償ゼロ。スタッフのメンタル安定により離職1名→0名。",
    tag: "対応時間 81%削減",
    tagColor: "bg-green-100 text-green-800",
  },
  {
    industry: "ECショップ（月商800万円）",
    icon: "📦",
    problem: "返品・返金クレームの対応文が人によってバラバラ。新人スタッフが誤った文言で返信し、消費者契約法上のリスクが発生したことも。",
    solution: "業種「EC・通販」+返答スタイル「穏便型/毅然型」の選択で、法的リスクを踏まえた対応文を統一出力。全スタッフが同じ品質で即回答できる体制に。",
    result: "クレーム対応品質の標準化達成。法的トラブル0件。リピーター率が対応改善後3ヶ月で+8%向上。",
    tag: "対応品質を統一",
    tagColor: "bg-blue-100 text-blue-800",
  },
  {
    industry: "美容サロン（スタッフ8名）",
    icon: "✂",
    problem: "施術結果への不満クレームを受けた際、どこまで謝罪・補償すべきか判断できず、毎回オーナーに確認する必要があった。義務化対応の社内マニュアルも未整備。",
    solution: "カスハラ判定でエスカレーション基準を明確化。義務化対策チェックリスト15項目で未対応箇所を特定し、対応フロー・マニュアルをAIで即整備。",
    result: "オーナーへのエスカレーション月8件→1件。2026年義務化対応を3日間で完了。顧客満足度アンケートで対応評価が4.1→4.7に向上。",
    tag: "義務化対応を3日で完了",
    tagColor: "bg-red-100 text-red-800",
  },
];

const BTOB_CLIENTS = [
  { icon: "🏢", type: "小売業", size: "従業員50名", usage: "月平均12件のクレーム対応を統一化" },
  { icon: "🏥", type: "クリニック", size: "スタッフ12名", usage: "医療クレーム・カスハラ判定で受付負担軽減" },
  { icon: "🏨", type: "ホテル", size: "客室100室", usage: "フロント対応スクリプトをチーム共有" },
  { icon: "🏪", type: "飲食チェーン", size: "5店舗運営", usage: "義務化前にカスハラマニュアルを整備" },
];

// カスハラ義務化 対策チェックリスト（15項目）
const COMPLIANCE_CHECKLIST = [
  { id: 1, category: "方針整備", text: "カスタマーハラスメントの定義と方針を社内で明文化している" },
  { id: 2, category: "方針整備", text: "カスハラ対策の担当者または責任者を指定している" },
  { id: 3, category: "方針整備", text: "カスハラと正当なクレームの判定基準を定めている" },
  { id: 4, category: "マニュアル", text: "カスハラ発生時の対応フローチャートがある" },
  { id: 5, category: "マニュアル", text: "エスカレーション手順（上司・警察・弁護士連携）が明文化されている" },
  { id: 6, category: "マニュアル", text: "業種別の典型的なカスハラ事例と対応例が整備されている" },
  { id: 7, category: "研修・周知", text: "従業員へのカスハラ対応研修を実施している（年1回以上）" },
  { id: 8, category: "研修・周知", text: "新入社員へのカスハラ対応オリエンテーションを行っている" },
  { id: 9, category: "証拠保全", text: "クレーム・カスハラの発生記録をシステムまたは紙で残している" },
  { id: 10, category: "証拠保全", text: "電話・対面での対応内容を記録する仕組みがある" },
  { id: 11, category: "従業員保護", text: "カスハラ被害を受けた従業員が相談できる窓口がある" },
  { id: 12, category: "従業員保護", text: "精神的被害を受けた従業員へのフォロー体制がある" },
  { id: 13, category: "従業員保護", text: "一人での対応を禁止し、複数対応できる体制を整えている" },
  { id: 14, category: "法的対応", text: "悪質なカスハラに対し業務委託または顧問弁護士に相談できる" },
  { id: 15, category: "法的対応", text: "警察への相談・届出の手順を社内で把握している" },
];

function ComplianceChecklist() {
  const [checked, setChecked] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const toggle = (id: number) => setChecked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const score = checked.length;
  const pct = Math.round((score / COMPLIANCE_CHECKLIST.length) * 100);
  const level = pct >= 80 ? { label: "対応済み", color: "text-green-600", bg: "bg-green-50 border-green-200", bar: "bg-green-500" }
    : pct >= 50 ? { label: "一部未対応", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", bar: "bg-yellow-500" }
    : { label: "対応不足", color: "text-red-600", bg: "bg-red-50 border-red-200", bar: "bg-red-500" };
  const categories = Array.from(new Set(COMPLIANCE_CHECKLIST.map(c => c.category)));

  return (
    <div className="mt-8">
      {!revealed ? (
        <div className="text-center">
          <div className="inline-block bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            企業の8割がカスハラ対策未整備（Helpfeel 2024年調査）
          </div>
          <p className="text-gray-600 text-sm mb-5">あなたの会社の義務化対応状況を15項目でセルフチェックできます</p>
          <button
            onClick={() => setRevealed(true)}
            className="bg-red-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-red-700 shadow-lg hover:scale-105 transition-transform text-sm"
          >
            今すぐ準備度チェックを開始する（無料）
          </button>
        </div>
      ) : (
        <div>
          <div className={`rounded-2xl border p-5 mb-5 ${level.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">対策完了率</span>
              <span className={`text-lg font-black ${level.color}`}>{pct}% — {level.label}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className={`${level.bar} h-3 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">{score}/{COMPLIANCE_CHECKLIST.length} 項目対応済み</p>
          </div>
          {categories.map(cat => (
            <div key={cat} className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{cat}</p>
              <div className="space-y-2">
                {COMPLIANCE_CHECKLIST.filter(c => c.category === cat).map(item => (
                  <label key={item.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${checked.includes(item.id) ? "bg-green-50 border-green-300" : "bg-white border-gray-200 hover:border-gray-300"}`}>
                    <input
                      type="checkbox"
                      checked={checked.includes(item.id)}
                      onChange={() => toggle(item.id)}
                      className="mt-0.5 w-4 h-4 accent-green-500"
                    />
                    <span className={`text-sm ${checked.includes(item.id) ? "text-green-700 line-through" : "text-gray-700"}`}>{item.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          {score < COMPLIANCE_CHECKLIST.length && (
            <div className="bg-blue-600 text-white rounded-2xl p-5 text-center mt-4">
              <p className="font-bold mb-2">未対応 {COMPLIANCE_CHECKLIST.length - score} 項目をAIで即整備できます</p>
              <p className="text-sm text-blue-100 mb-4">対応フロー・マニュアル・記録テンプレート・断り文言をセットで生成</p>
              <a href="/tool" className="inline-block bg-white text-blue-600 font-bold px-6 py-2.5 rounded-xl hover:bg-blue-50 text-sm">
                クレームAIで対応文書を作成する →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 成功事例ケーススタディ
function CaseStudiesSection() {
  const [active, setActive] = useState(0);
  const c = CASE_STUDIES[active];
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">導入事例</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">クレームAI導入後の変化</h2>
          <p className="text-sm text-gray-500">業種別の実際の活用シーン（内容はモデルケースです）</p>
        </div>
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {CASE_STUDIES.map((cs, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`text-sm px-4 py-2 rounded-full border font-medium transition-colors ${active === i ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
            >
              {cs.icon} {cs.industry}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <span className="text-3xl">{c.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{c.industry}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.tagColor}`}>{c.tag}</span>
              </div>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">課</div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">導入前の課題</p>
                <p className="text-sm text-gray-700 leading-relaxed">{c.problem}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">解</div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">クレームAIの活用方法</p>
                <p className="text-sm text-gray-700 leading-relaxed">{c.solution}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">果</div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">導入後の結果</p>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{c.result}</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">※上記はモデルケースです。実際の導入効果は環境・使用状況により異なります。</p>
        <div className="text-center mt-6">
          <a href="/tool" className="inline-block bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 text-sm shadow-lg shadow-blue-100">
            自分の業種で試してみる（無料）→
          </a>
        </div>
      </div>
    </section>
  );
}

// 競合比較表
function CompetitorComparison() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">他サービスとの比較</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">クレームAIが選ばれる理由</h2>
          <p className="text-sm text-gray-500">カスハラ対策ツールの機能・料金を比較</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-700 rounded-tl-xl">機能</th>
                <th className="p-3 font-bold text-blue-700 bg-blue-50">クレームAI<br /><span className="text-xs font-normal text-blue-500">¥2,980/月〜</span></th>
                <th className="p-3 font-semibold text-gray-600">IVRy<br /><span className="text-xs font-normal text-gray-400">¥3,317/月〜</span></th>
                <th className="p-3 font-semibold text-gray-600 rounded-tr-xl">さくらさん<br /><span className="text-xs font-normal text-gray-400">要問い合わせ</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { feature: "クレーム対応文の即時生成", claim: "✅", ivry: "❌", sakura: "❌" },
                { feature: "カスハラ判定（正当クレーム区別）", claim: "✅", ivry: "△", sakura: "✅" },
                { feature: "お詫び状・書面の自動作成", claim: "✅", ivry: "❌", sakura: "❌" },
                { feature: "社内インシデント記録生成", claim: "✅", ivry: "△", sakura: "❌" },
                { feature: "業種別カスタマイズ対応", claim: "✅", ivry: "❌", sakura: "❌" },
                { feature: "電話AI自動応答", claim: "❌", ivry: "✅", sakura: "✅" },
                { feature: "義務化対策チェックリスト", claim: "✅", ivry: "❌", sakura: "❌" },
                { feature: "今すぐ使える（登録不要）", claim: "✅", ivry: "❌", sakura: "❌" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="p-3 text-gray-700">{row.feature}</td>
                  <td className="p-3 text-center font-bold text-blue-600 bg-blue-50/50">{row.claim}</td>
                  <td className="p-3 text-center text-gray-500">{row.ivry}</td>
                  <td className="p-3 text-center text-gray-500">{row.sakura}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">※2026年3月時点の各社公開情報をもとに作成。詳細は各社サービスページをご確認ください。</p>
        <div className="text-center mt-6">
          <a href="/tool" className="inline-block bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 text-sm shadow-lg">
            無料で試す（登録不要） →
          </a>
        </div>
      </div>
    </section>
  );
}

function RoiCalculator() {
  const [count, setCount] = useState(10);
  const [minutes, setMinutes] = useState(60);
  const hourlyRate = 2000;
  const savedHours = Math.round((count * minutes) / 60 * 10) / 10;
  const savedCost = Math.round(savedHours * hourlyRate / 10000 * 10) / 10;
  return (
    <div className="bg-gray-800 rounded-2xl p-6 mt-8">
      <p className="text-yellow-400 font-bold text-sm mb-4">💰 削減できるコストを計算</p>
      <div className="space-y-5">
        <div>
          <label className="text-gray-300 text-xs font-medium block mb-2">月間クレーム件数: <span className="text-white font-bold text-lg">{count}件</span></label>
          <input
            type="range"
            min={1}
            max={100}
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-yellow-400"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1"><span>1件</span><span>100件</span></div>
        </div>
        <div>
          <label className="text-gray-300 text-xs font-medium block mb-2">1件あたりの対応時間</label>
          <div className="flex gap-2">
            {[30, 60, 120].map(m => (
              <button
                key={m}
                onClick={() => setMinutes(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${minutes === m ? "bg-yellow-400 text-gray-900" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
              >
                {m}分
              </button>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-yellow-400/30">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">月間削減時間</p>
              <p className="text-2xl font-black text-yellow-400">{savedHours}<span className="text-sm font-normal text-gray-400">時間</span></p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">削減コスト（目安）</p>
              <p className="text-2xl font-black text-green-400">約¥{savedCost}<span className="text-sm font-normal text-gray-400">万円</span></p>
            </div>
          </div>
          <p className="text-gray-500 text-xs text-center mt-2">時給¥2,000換算 / クレームAI導入費用¥9,800/月との比較</p>
        </div>
      </div>
    </div>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setShowPayjp(false)} className="absolute top-3 right-3 text-gray-400 text-xl">✕</button>
            <div className="text-3xl mb-3 text-center">🆘</div>
            <h2 className="text-lg font-bold mb-2 text-center">プレミアムプラン</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">{planLabel}</p>
            <KomojuButton planId="standard" planLabel={planLabel} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
          </div>
        </div>
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-blue-100">
            飲食・EC・美容・ホテル・小売・IT 全業種対応
          </div>
          {/* リアルタイム風バッジ */}
          <div className="mb-5 inline-flex items-center gap-2 bg-white border border-blue-200 rounded-full px-4 py-2 text-sm shadow-sm">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-400">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            </span>
            <span className="text-blue-700 font-semibold">2026年10月 カスハラ対策義務化 — <strong>今すぐ準備を</strong></span>
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
          <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 mb-3 hover:scale-105 transition-transform">
            無料で3回試す →
          </Link>
          <p className="text-sm font-semibold text-gray-500">クレジットカード不要・登録不要・今すぐ使える</p>
          <div className="mt-4">
            <a href="#btob" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-semibold border border-blue-200 bg-blue-50 px-5 py-2.5 rounded-full transition">
              🏢 法人・チーム導入はこちら（¥9,800/月）→
            </a>
          </div>
        </div>
      </section>

      {/* 実績カウンター */}
      <section className="bg-red-700 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center text-white">
          <div>
            <p className="text-3xl font-black">15<span className="text-lg">秒</span></p>
            <p className="text-sm opacity-80">平均生成時間</p>
          </div>
          <div>
            <p className="text-3xl font-black">4<span className="text-lg">種類</span></p>
            <p className="text-sm opacity-80">同時生成（スクリプト・書面・記録・判定）</p>
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

      {/* 成功事例ケーススタディ */}
      <CaseStudiesSection />

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
          {/* 義務化対策チェックリスト */}
          <div className="mt-12 border-t border-red-100 pt-10">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">義務化対策 準備度チェックリスト（15項目）</h3>
              <p className="text-sm text-gray-500">2026年10月施行の改正労働施策総合推進法に向けた自社の対応状況を確認しましょう</p>
            </div>
            <ComplianceChecklist />
          </div>
        </div>
      </section>

      {/* 競合比較表 */}
      <CompetitorComparison />

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
              { q: "2026年10月のカスハラ義務化に向けて何を準備すればいいですか？", a: "改正労働施策総合推進法により、全事業主に①カスハラ防止方針の策定、②対応マニュアルの整備、③従業員研修の実施、④相談窓口の設置が義務化されます。クレームAIの義務化対策チェックリスト（15項目）で自社の対応状況を確認し、未対応箇所をAIで即整備できます。" },
              { q: "東京都のカスハラ対策奨励金は実際に申請できますか？", a: "東京都しごと財団が実施する「カスハラ対策奨励金（最大¥40万）」制度です。クレームAIがツール費用の補助対象に該当するかは、申請時に東京都しごと財団にご確認ください。年間利用費用¥35,760〜を大幅に補填できる可能性があります。" },
              { q: "クレーム対応の法的根拠はどのように使えばいいですか？", a: "AIが生成する対応文には、消費者契約法・PL法（製造物責任法）・民法709条（不法行為）など関連法条文が自動的に引用されます。書面をそのまま弁護士への相談資料や社内エスカレーション記録としてお使いいただけます。" },
              { q: "複数の店舗やスタッフで共有できますか？", a: "ビジネスプラン（¥9,800/月）ではチームアカウントとして複数スタッフが同じツールを利用できます。対応品質の統一化と、新人スタッフの即戦力化を同時に実現できます。" },
              { q: "クレームの深刻度はどう判定されますか？", a: "感情温度（普通・強い・激しい）、カスハラ疑いの有無、補償要求の有無を組み合わせてAIが法的リスクスコア（1〜10）と緊急度（即日・1週間・余裕あり）を判定します。深刻度に応じた対応文・書面・エスカレーション手順が自動選択されます。" },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2 text-sm">Q. {faq.q}</p>
                <p className="text-sm text-gray-600">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 導入企業モック（社会的証明） */}
      <section className="bg-gray-900 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400 text-xs font-semibold uppercase tracking-widest mb-6">こんな企業・施設に選ばれています</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BTOB_CLIENTS.map(c => (
              <div key={c.type} className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
                <div className="text-3xl mb-2">{c.icon}</div>
                <p className="text-white font-bold text-sm mb-0.5">{c.type}</p>
                <p className="text-gray-400 text-xs mb-2">{c.size}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{c.usage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BtoB 法人向けセクション */}
      <section id="btob" className="bg-gray-900 text-white py-20 px-6 border-t border-gray-800">
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
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <p className="text-xs text-gray-500 text-center font-semibold">法人・チーム導入のご相談</p>
                <a
                  href="/contact"
                  className="block w-full text-center text-sm font-medium py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  📋 法人問い合わせフォームはこちら →
                </a>
                <p className="text-xs text-gray-400 text-center">
                  請求書払い・複数拠点契約・カスタマイズ対応もご相談ください<br />
                  X: <a href="https://x.com/levona_design" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">@levona_design</a>
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
          {/* ROI計算ミニツール */}
          <RoiCalculator />
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

      {/* クレームAIだけができること — SEO差別化セクション */}
      <section className="bg-indigo-50 border-y border-indigo-100 py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-3">クレームAIだけの機能</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">「クレーム対応文+法的根拠+社内記録」を1回の生成で</h2>
            <p className="text-sm text-gray-500">IVRy（電話AI）・さくらさんにはない、文書生成に特化した3つの独自機能</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "⚖️", title: "法条文を自動付加", desc: "出力文に消費者契約法・PL法・カスハラ対策指針など関連法条文を自動引用。「法的に正しい対応」を担保します。", badge: "IVRyにはない" },
              { icon: "📋", title: "1回で4種類の書類を生成", desc: "口頭スクリプト・お詫び状・社内インシデント記録・カスハラ判定を同時生成。バラバラに依頼する手間がゼロ。", badge: "さくらさんにはない" },
              { icon: "🏭", title: "業種別の専門文言", desc: "飲食・EC・美容・ホテル・医療介護など業種ごとの業界慣習・補償基準を踏まえた専門的な文章を生成。", badge: "汎用AIにはない" },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white border border-indigo-200 rounded-2xl p-5 max-w-2xl mx-auto">
            <p className="text-xs font-bold text-indigo-700 mb-3 text-center">クレームAI vs 競合 — 機能比較まとめ</p>
            <div className="grid grid-cols-4 text-xs text-center gap-2">
              <div className="font-bold text-gray-600 text-left">機能</div>
              <div className="font-bold text-blue-700">クレームAI</div>
              <div className="font-bold text-gray-500">IVRy</div>
              <div className="font-bold text-gray-500">さくらさん</div>
              {["対応文即時生成", "法的根拠の引用", "社内記録生成", "業種別対応", "登録不要で利用可"].map(feat => (
                <>
                  <div key={feat} className="text-left text-gray-600 py-1 border-t border-gray-100">{feat}</div>
                  <div className="text-blue-600 font-bold py-1 border-t border-gray-100">✅</div>
                  <div className="text-gray-400 py-1 border-t border-gray-100">{feat === "対応文即時生成" ? "❌" : feat === "業種別対応" ? "❌" : feat === "法的根拠の引用" ? "❌" : "△"}</div>
                  <div className="text-gray-400 py-1 border-t border-gray-100">{feat === "対応文即時生成" ? "❌" : feat === "社内記録生成" ? "❌" : feat === "登録不要で利用可" ? "❌" : "△"}</div>
                </>
              ))}
            </div>
          </div>
          <div className="text-center mt-6">
            <a href="/tool" className="inline-block bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 text-sm shadow-lg">
              クレームAIの全機能を無料で試す →
            </a>
          </div>
        </div>
      </section>

      {/* X Share */}
      <section className="py-6 px-6 text-center">
        <a
          href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent("クレームAI — 理不尽なクレーム・カスハラを15秒でプロ品質の対応文書に変換💼 顧客対応・カスタマーサポートに超便利 → https://claim-ai-beryl.vercel.app #クレーム対応 #カスハラ #AI")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Xでシェアする
        </a>
      </section>

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
