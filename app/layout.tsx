import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://claim-ai-beryl.vercel.app";
const TITLE = "AIクレーム対応文ジェネレーター｜30秒でプロ品質の対応文を自動生成";
const DESC = "クレーム内容を入力するだけ。お詫び文・原因説明・再発防止策をAIが自動構成。飲食・EC・小売・ホテルなど業種別対応。メール文＋電話スクリプト＋チェックリスト付き。無料3回。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>😤</text></svg>" },
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
