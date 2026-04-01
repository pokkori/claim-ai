import type { Metadata } from "next";
import { Noto_Sans_JP, M_PLUS_Rounded_1c } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import FeedbackButton from "@/components/FeedbackButton";
import { GoogleAdScript } from "@/components/GoogleAdScript";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

const mPlusRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-rounded",
});


const SITE_URL = "https://claim-ai.vercel.app";
const TITLE = "クレームAI｜カスハラ対策・クレーム対応文を15秒で自動生成【2026年義務化対応】";
const DESC = "クレーム内容を入力するだけ。お詫び文・口頭スクリプト・社内記録・カスハラ判定の4種をAIが自動生成。2026年10月義務化対応チェックリスト付き。飲食・EC・ホテル・美容など業種別対応。登録不要・無料3回。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  icons: { icon: "/favicon.ico" },
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
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "クレームAI - カスハラ対策・クレーム対応文を自動生成" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [`${SITE_URL}/og.png`],
  },
  metadataBase: new URL(SITE_URL),
  other: { "theme-color": "#0B0F1E" },
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
        { "@type": "Question", "name": "クレーム対応の録音は合法ですか？", "acceptedAnswer": { "@type": "Answer", "text": "自社の従業員が業務として行うクレーム対応の録音は、通話の一方が当事者であれば原則として合法です（一般的に「自己録音」として認められています）。ただし「録音しています」と事前に告知することで証拠能力が高まり、クレーマーの言動抑止にも効果的です。録音した音声は社内インシデント記録として保管し、法的対応が必要になった際の証拠として活用してください。" } },
        { "@type": "Question", "name": "同じクレーマーが繰り返し来る場合はどう対応すればいいですか？", "acceptedAnswer": { "@type": "Answer", "text": "繰り返し来店・連絡するクレーマーには、対応記録を蓄積した上で「書面による通知」→「着信拒否・来店禁止」→「法的措置（接近禁止の仮処分等）」の順でエスカレーションするのが原則です。クレームAIでは「記録型」返答スタイルを選択することで、証拠保全・エスカレーション準備を意識した対応文が生成されます。再発防止のため対応履歴を必ずシステムに記録してください。" } },
        { "@type": "Question", "name": "警察に相談できるクレームケースはどんな場合ですか？", "acceptedAnswer": { "@type": "Answer", "text": "「殺す」「爆破する」などの脅迫（刑法222条）、暴力的な行為（暴行罪・傷害罪）、不退去（不退去罪）、店舗前での執拗な嫌がらせ（業務妨害罪）の場合は警察に相談できます。まず「被害届」ではなく「相談」として警察署に連絡し、対応記録・録音・録画を持参することを推奨します。クレームAIが生成するインシデント記録テンプレートを活用して、事実を時系列で整理してください。" } },
        { "@type": "Question", "name": "クレームと正当な苦情の違いは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "「正当な苦情」は商品・サービスの欠陥や不備に基づく問い合わせや改善要求で、企業が誠実に対応すべき貴重なフィードバックです。一方「クレーム（カスタマーハラスメント）」は要求内容の不当性（過大な金銭要求・謝罪強要）や手段の不当性（暴言・脅迫・長時間拘束）が含まれます。厚労省2023年カスハラ対策指針に基づき、クレームAIがどちらに該当するかを自動判定し、正当苦情には誠実対応文、カスハラには毅然とした断り文を生成します。" } },
        { "@type": "Question", "name": "クレームが訴訟に発展した場合の対応はどうすればいいですか？", "acceptedAnswer": { "@type": "Answer", "text": "訴訟予告・内容証明郵便が届いた場合は、必ず弁護士に相談してください。対応を誤ると不利な証拠が残ったり、示談交渉の余地が狭まる可能性があります。クレームAIはあくまで初期対応文の参考情報です。訴訟リスクが高いケースでは、クレームAIが「法的対応検討が必要」と判定し弁護士紹介サービスへの導線を表示します。平時から対応記録を保存しておくことが、訴訟対応での最重要ポイントです。" } },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`dark ${notoSansJP.variable} ${mPlusRounded.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        {children}
        <PWAInstallBanner />
        <footer className="flex justify-center py-2">
          <FeedbackButton serviceName="クレームAI" />
        </footer>
        <Analytics />
        <SpeedInsights />
        <GoogleAdScript />
        {/* Microsoft Clarity: IDが設定されたら追加する */}
      </body>
    </html>
  );
}
