import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://claim-ai-beryl.vercel.app";
const TITLE = "クレームAI｜カスハラ対策・クレーム対応文を15秒で自動生成【2026年義務化対応】";
const DESC = "クレーム内容を入力するだけ。お詫び文・口頭スクリプト・社内記録・カスハラ判定の4種をAIが自動生成。2026年10月義務化対応チェックリスト付き。飲食・EC・ホテル・美容など業種別対応。登録不要・無料3回。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>😤</text></svg>" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "クレームAI",
  },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "AIクレーム対応文ジェネレーター",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
  },
  metadataBase: new URL(SITE_URL),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "AIクレーム対応文ジェネレーター",
      "url": SITE_URL,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY", "description": "無料3回" },
      "description": DESC,
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "無料で何回使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "登録不要・クレジットカード不要で3回まで無料でご利用いただけます。" } },
        { "@type": "Question", "name": "どんな業種に対応していますか？", "acceptedAnswer": { "@type": "Answer", "text": "飲食店・ECショップ・ホテル・小売・美容など幅広い業種に対応しています。業種を選択するだけで最適な対応文が生成されます。" } },
        { "@type": "Question", "name": "生成された文章はそのまま使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "AIの生成結果はあくまで参考情報です。実際の使用前に内容を確認・修正してご利用ください。" } },
        { "@type": "Question", "name": "解約はいつでもできますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい、マイページからいつでも解約できます。解約後は次回更新日まで引き続きご利用いただけます。" } },
        { "@type": "Question", "name": "2026年10月のカスハラ義務化に向けた対策チェックリストはありますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。改正労働施策総合推進法に対応した15項目の義務化対策チェックリストを無料公開しています。方針整備・マニュアル・研修・証拠保全・従業員保護・法的対応の6カテゴリで自社の対応状況を確認できます。" } },
        { "@type": "Question", "name": "カスタマーハラスメントと正当なクレームはどう見分ければいいですか？", "acceptedAnswer": { "@type": "Answer", "text": "厚労省2023年カスハラ対策指針を基に、要求内容の正当性・手段の不当性（暴言・脅迫・長時間拘束等）で判定します。クレームAIのカスハラ判定機能が自動で判定し、正当クレームには誠実対応、不当要求には毅然とした断り文を生成します。" } },
        { "@type": "Question", "name": "クレーム対応に使える法的根拠を教えてください", "acceptedAnswer": { "@type": "Answer", "text": "消費者契約法（不当条項・取消権）、民法709条（不法行為による損害賠償）、製造物責任法（PL法）、景品表示法など、クレームの種類に応じた法的根拠をAIが自動的に対応文に組み込みます。カスハラ（カスタマーハラスメント）には改正労働施策総合推進法第30条の7が根拠となります。" } },
        { "@type": "Question", "name": "SNSへの拡散リスクがある場合はどう対応すればいいですか？", "acceptedAnswer": { "@type": "Answer", "text": "クレームAIでは感情温度「重度」・カスハラ疑いを選択すると、SNS拡散リスクを考慮した初動対応文が生成されます。不実投稿への法的対処（名誉毀損・侮辱罪）の説明と、投稿を抑止するための誠実対応文のバランスを取った内容が出力されます。" } },
        { "@type": "Question", "name": "クレーム対応の社内マニュアルはどうやって作ればいいですか？", "acceptedAnswer": { "@type": "Answer", "text": "クレームAIのビジネスプラン（¥9,800/月）では、厚生労働省ガイドライン準拠のカスハラ判定基準・対応フロー・エスカレーション手順を含む社内マニュアルをAIが自動生成します。義務化（2026年10月施行）の証拠書類として保存できる形式で出力されます。" } },
        { "@type": "Question", "name": "東京都のカスハラ対策奨励金は利用できますか？", "acceptedAnswer": { "@type": "Answer", "text": "東京都しごと財団が実施する「カスハラ対策奨励金（最大¥40万）」は、カスハラ対策ツール導入費用の補助制度です。クレームAIが補助対象に該当するかは、申請時に東京都しごと財団にご確認ください。年間利用費用¥35,760〜を大幅に補填できる可能性があります。" } },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <PWAInstallBanner />
        <Analytics />
        {/* Microsoft Clarity — pokkoriがhttps://clarity.microsoft.com/でプロジェクト登録後にIDを設定 */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "CLARITY_PROJECT_ID_HERE");
          `}
        </Script>
      </body>
    </html>
  );
}
