import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー｜AIクレーム対応文ジェネレーター",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">← トップに戻る</Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>

        <p className="text-sm text-gray-500 mb-8">最終更新日：2026年3月</p>

        <section className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="font-bold text-gray-900 mb-2">1. 事業者情報</h2>
            <p>本サービス「AIクレーム対応文ジェネレーター」（以下「本サービス」）は、個人が運営するWebサービスです。</p>
          </div>

          <div>
            <h2 className="font-bold text-gray-900 mb-2">2. 取得する情報</h2>
            <p>本サービスでは、以下の情報を取得する場合があります。</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>フォームに入力いただいた情報（業種・クレーム内容など）</li>
              <li>Cookie（利用回数の管理に使用）</li>
              <li>アクセスログ（IPアドレス・ブラウザ情報）</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-gray-900 mb-2">3. 利用目的</h2>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>AIによる文章生成サービスの提供</li>
              <li>無料利用回数の管理</li>
              <li>不正利用の防止</li>
              <li>サービス改善のための利用状況分析</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-gray-900 mb-2">4. 第三者提供</h2>
            <p>取得した情報は、以下の場合を除き第三者に提供しません。</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>法令に基づく場合</li>
              <li>AI生成のためにAnthropicのAPIへ入力内容を送信する場合（Anthropicのプライバシーポリシーが適用されます）</li>
              <li>決済処理のためPAY.JP（PAY.JP株式会社）に提供する場合（PAY.JPのプライバシーポリシーに従います）</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-gray-900 mb-2">5. Cookieの使用</h2>
            <p>本サービスでは、無料利用回数を管理するためにCookieを使用しています。ブラウザの設定によりCookieを無効にすることができますが、一部機能が正常に動作しない場合があります。</p>
          </div>

          <div>
            <h2 className="font-bold text-gray-900 mb-2">6. アクセス解析</h2>
            <p>本サービスでは、Vercel Analyticsを使用してアクセス状況を分析しています。個人を特定する情報は収集しません。</p>
          </div>

          <div>
            <h2 className="font-bold text-gray-900 mb-2">7. 免責事項</h2>
            <p>本サービスが生成するコンテンツはAIによる自動生成であり、情報提供を目的としています。生成内容の正確性・適切性を保証するものではありません。実際のクレーム対応については専門家にご相談ください。</p>
          </div>

          <div>
            <h2 className="font-bold text-gray-900 mb-2">8. ポリシーの変更</h2>
            <p>本ポリシーは予告なく変更する場合があります。変更後は本ページに掲載した時点で効力を生じます。</p>
          </div>

          <div>
            <h2 className="font-bold text-gray-900 mb-2">9. お問い合わせ</h2>
            <p>本ポリシーに関するご質問は levonadesign@gmail.com までご連絡ください。</p>
          </div>
        </section>
      </article>
    </main>
  );
}
