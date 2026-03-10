import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約｜AIクレーム対応文",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b px-6 py-4">
        <Link href="/" className="font-bold text-gray-900">AIクレーム対応文</Link>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-12 text-sm text-gray-700 leading-relaxed space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">利用規約</h1>

        <section>
          <h2 className="font-bold text-base mb-2">第1条（適用）</h2>
          <p>本利用規約（以下「本規約」）は、levonadesign（以下「当社」）が提供するAIクレーム対応文サービス（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本規約に同意の上、本サービスをご利用ください。</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">第2条（サービス内容）</h2>
          <p>本サービスは、AIを活用したクレーム対応文の生成支援サービスです。AIの生成内容はあくまで参考情報であり、正確性・完全性・適切性を保証するものではありません。</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">第3条（料金・決済）</h2>
          <p>本サービスの利用料金は以下の通りです。</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
            <li>スタンダードプラン：¥4,980/月（税込）</li>
            <li>ビジネスプラン：¥9,800/月（税込）</li>
          </ul>
          <p className="mt-2">決済はPAY.JP（PAY.JP株式会社）を通じて処理されます。お申込み時に即時決済され、以降は毎月同日に自動更新されます。</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">第4条（解約・返金）</h2>
          <p>デジタルコンテンツの性質上、決済完了後の返金は承っておりません。解約はいつでもマイページより行えます。解約後は次回更新日まで引き続きご利用いただけます。</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">第5条（禁止事項）</h2>
          <p>以下の行為を禁止します。</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
            <li>法令または公序良俗に違反する行為</li>
            <li>本サービスを通じて生成したコンテンツの無断商業利用・転売</li>
            <li>サービスの逆コンパイル・改ざん・不正アクセス</li>
            <li>他のユーザーや第三者への迷惑行為</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">第6条（免責事項）</h2>
          <p>本サービスの利用によって生じた損害について、当社は一切の責任を負いません。AIの生成結果を利用した対応・交渉の結果についても同様です。</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">第7条（サービスの変更・停止）</h2>
          <p>当社は予告なく本サービスの内容を変更・停止することがあります。</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">第8条（準拠法）</h2>
          <p>本規約は日本法に準拠し、東京地方裁判所を専属的合意管轄裁判所とします。</p>
        </section>

        <p className="text-gray-400 text-xs pt-4 border-t">制定日：2025年1月1日</p>
      </div>
    </div>
  );
}
