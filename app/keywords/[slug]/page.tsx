import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CrossSell } from "@/components/CrossSell";

/* ------------------------------------------------------------------ */
/*  Keyword data                                                       */
/* ------------------------------------------------------------------ */

interface KeywordData {
  title: string;
  h1: string;
  description: string;
  features: { icon: string; title: string; text: string }[];
  faqs: { q: string; a: string }[];
}

const KEYWORDS: Record<string, KeywordData> = {
  "claim-taiou-bun-rei": {
    title: "クレーム対応 文例｜業種別テンプレートをAIが30秒で自動生成",
    h1: "クレーム対応 文例",
    description:
      "飲食店・EC・ホテル別のクレーム対応文例をAIが30秒で自動生成。敬語・謝罪表現も最適化。登録不要・無料3回。",
    features: [
      {
        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        title: "30秒で生成",
        text: "クレーム内容を入力するだけ。AIが業種・状況に最適な文例を瞬時に作成します。",
      },
      {
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5h4v5m-4 0h4",
        title: "業種別テンプレート",
        text: "飲食店・ECショップ・ホテル・小売・美容など幅広い業種に対応した文例を用意。",
      },
      {
        icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        title: "敬語・法的根拠も最適化",
        text: "消費者契約法・民法など関連法規を踏まえた適切な表現をAIが自動的に組み込みます。",
      },
    ],
    faqs: [
      {
        q: "クレーム対応の文例はどんな業種に対応していますか？",
        a: "飲食店・ECショップ・ホテル・小売・美容・医療・製造業など幅広い業種に対応しています。業種を選択するだけで最適な文例が生成されます。",
      },
      {
        q: "生成された文例はそのまま使えますか？",
        a: "AIが状況に最適化した文例を生成しますが、実際のご利用前に内容を確認・修正してください。具体的な社名・日時・金額などは適宜変更してください。",
      },
      {
        q: "無料で何回使えますか？",
        a: "登録不要・クレジットカード不要で3回まで無料でご利用いただけます。それ以降は月額プランをご利用ください。",
      },
    ],
  },
  "customer-complaint-mail": {
    title: "クレーム メール返信｜AIが敬語・謝罪表現を最適化して自動作成",
    h1: "クレーム メール 返信",
    description:
      "クレームメールの返信文をAIが自動作成。敬語・謝罪表現も最適化。コピペで即使える返信文を30秒で生成。",
    features: [
      {
        icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
        title: "メール返信に特化",
        text: "件名・宛名・署名まで含めた完全なメール返信文をAIが生成。コピペですぐに使えます。",
      },
      {
        icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
        title: "敬語レベル自動調整",
        text: "クレームの深刻度に応じて敬語レベルを自動調整。過剰にならない適切な謝罪表現を生成します。",
      },
      {
        icon: "M13 10V3L4 14h7v7l9-11h-7z",
        title: "30秒で完成",
        text: "クレーム内容を貼り付けるだけ。AIが文脈を理解して最適な返信文を瞬時に作成します。",
      },
    ],
    faqs: [
      {
        q: "クレームメールの返信で気をつけるポイントは？",
        a: "まず謝罪と共感を示し、事実確認の姿勢を伝え、具体的な対応策を提示することが重要です。クレームAIはこれらのポイントを自動的に盛り込んだ返信文を生成します。",
      },
      {
        q: "英語のクレームメールにも対応していますか？",
        a: "現在は日本語のクレームメール返信に特化しています。日本のビジネスマナーに最適化された敬語・謝罪表現を生成します。",
      },
      {
        q: "返信文のトーンは調整できますか？",
        a: "はい。感情温度（軽度・中度・重度）を選択することで、謝罪の深さや敬語レベルを自動調整できます。",
      },
    ],
  },
  "insyokuten-claim-taiou": {
    title: "飲食店 クレーム対応｜異物混入・待ち時間・接客態度の対応文をAI生成",
    h1: "飲食店 クレーム対応",
    description:
      "異物混入・待ち時間・接客態度。飲食店のクレーム対応文をAIが生成。口頭スクリプト・お詫び文・社内記録の3種を30秒で作成。",
    features: [
      {
        icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z",
        title: "飲食店特化テンプレート",
        text: "異物混入・待ち時間・接客態度・料理の味・アレルギー対応など飲食店特有のクレームに完全対応。",
      },
      {
        icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
        title: "口頭スクリプト付き",
        text: "電話やお客様への直接対応で使える口頭スクリプトも同時に生成。話し方のコツ付き。",
      },
      {
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
        title: "社内記録も自動作成",
        text: "クレーム発生日時・内容・対応経緯・再発防止策を記録する社内報告書も同時生成。",
      },
    ],
    faqs: [
      {
        q: "異物混入クレームへの初動対応は？",
        a: "まずお客様の安全確認と謝罪、現物の保管、代替品の提供を行います。クレームAIは食品衛生法に基づいた適切な初動対応文と社内報告書を自動生成します。",
      },
      {
        q: "待ち時間クレームの適切な対応は？",
        a: "待ち時間の目安をお伝えし、お詫びと具体的な改善策（オペレーション見直し等）を提示します。AIが状況に応じた謝罪文と再発防止策を生成します。",
      },
      {
        q: "クレーム対応で法的に注意すべき点は？",
        a: "食品衛生法・消費者契約法・製造物責任法（PL法）が関連します。クレームAIは関連法規を踏まえた適切な対応文を生成し、過度な補償約束を避ける表現を使用します。",
      },
    ],
  },
  "ec-claim-taiou": {
    title: "ECショップ クレーム対応｜配送遅延・商品不良・返品の対応文をAI作成",
    h1: "ECショップ クレーム対応",
    description:
      "配送遅延・商品不良・返品対応。ECクレーム文例をAIが作成。メール返信テンプレートを30秒で自動生成。",
    features: [
      {
        icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
        title: "EC特化テンプレート",
        text: "配送遅延・商品不良・返品・サイズ違い・在庫切れなどEC特有のクレームに完全対応。",
      },
      {
        icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
        title: "返金・交換の表現最適化",
        text: "特定商取引法に準拠した返金・交換対応の文例を生成。法的リスクを最小化します。",
      },
      {
        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
        title: "対応期限も明示",
        text: "返品期限・返金処理日数など具体的な期限を含む対応文を生成。顧客の不安を解消します。",
      },
    ],
    faqs: [
      {
        q: "配送遅延のクレームにどう対応すべき？",
        a: "まず遅延のお詫びと現在の配送状況を伝え、到着予定日を明示します。クレームAIは配送業者との連携状況も含めた適切な返信文を自動生成します。",
      },
      {
        q: "返品・返金対応で法的に注意すべき点は？",
        a: "特定商取引法に基づくクーリングオフ制度（通信販売は適用外だが返品特約の明示が必要）、消費者契約法に基づく取消権が関連します。AIがこれらを踏まえた対応文を生成します。",
      },
      {
        q: "レビューに悪評を書かれた場合の対応は？",
        a: "公開レビューには誠実に返信し、個別対応はDM・メールで行うのが基本です。クレームAIは公開返信用とDM用の2パターンの対応文を生成できます。",
      },
    ],
  },
  "hotel-claim-taiou": {
    title: "ホテル クレーム対応｜騒音・清掃不備・予約ミスの対応文をAI生成",
    h1: "ホテル クレーム対応",
    description:
      "騒音・清掃不備・予約ミス。ホテルのクレーム対応文をAIが生成。フロント対応・メール返信・社内報告の3種を自動作成。",
    features: [
      {
        icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        title: "ホテル特化テンプレート",
        text: "騒音・清掃不備・予約ミス・設備故障・アメニティ不足などホテル特有のクレームに完全対応。",
      },
      {
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
        title: "フロント対応スクリプト",
        text: "チェックイン・チェックアウト時のフロント対応スクリプトも生成。新人スタッフでも安心。",
      },
      {
        icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
        title: "口コミ返信も対応",
        text: "Googleマップ・OTA（Booking.com等）の口コミ返信文もAIが生成。評価回復につなげます。",
      },
    ],
    faqs: [
      {
        q: "騒音クレームへの適切な初動対応は？",
        a: "まずお客様に謝罪し、部屋の変更を提案します。他の宿泊客への注意喚起も行います。クレームAIは状況に応じた初動対応スクリプトと報告書を自動生成します。",
      },
      {
        q: "清掃不備のクレームで補償は必要？",
        a: "清掃不備の程度によりますが、部屋の清掃やりなおし・部屋変更・次回割引券の提供が一般的です。AIが状況に応じた適切な補償提案を含む対応文を生成します。",
      },
      {
        q: "予約ミス（オーバーブッキング）の対応は？",
        a: "旅行業法・消費者契約法に基づき、代替宿泊先の手配・差額負担・交通費補助が必要です。クレームAIは法的根拠を踏まえた適切な対応文と補償提案を生成します。",
      },
    ],
  },
  "kujou-taiou-manual": {
    title: "苦情対応マニュアル｜業種別チェックリスト付きでAIが自動作成",
    h1: "苦情対応 マニュアル",
    description:
      "業種別の苦情対応マニュアルをAIが自動作成。チェックリスト付き。2026年カスハラ義務化対応。",
    features: [
      {
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
        title: "チェックリスト付き",
        text: "苦情受付→初動対応→エスカレーション→解決→再発防止の各ステップをチェックリスト形式で提供。",
      },
      {
        icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
        title: "業種別カスタマイズ",
        text: "飲食・EC・ホテル・小売・医療など業種を選ぶだけで最適なマニュアルを自動生成。",
      },
      {
        icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        title: "2026年義務化対応",
        text: "改正労働施策総合推進法（2026年10月施行）に対応したカスハラ対策項目を網羅。",
      },
    ],
    faqs: [
      {
        q: "苦情対応マニュアルに必ず入れるべき項目は？",
        a: "苦情受付手順・初動対応フロー・エスカレーション基準・記録方法・再発防止策の5項目は必須です。クレームAIはこれらを含む包括的なマニュアルを自動生成します。",
      },
      {
        q: "2026年のカスハラ義務化でマニュアルは必須？",
        a: "はい。改正労働施策総合推進法により、事業主はカスハラ対策の方針整備・マニュアル作成・研修実施が義務化されます。クレームAIで義務化対応マニュアルを作成できます。",
      },
      {
        q: "マニュアルの更新頻度はどのくらいが適切？",
        a: "最低でも年1回、法改正時や重大クレーム発生時には都度更新が推奨です。クレームAIなら法改正を反映した最新マニュアルをいつでも再生成できます。",
      },
    ],
  },
  "claim-denwa-script": {
    title: "クレーム電話 スクリプト｜話し方のコツ付きでAIが自動生成",
    h1: "クレーム 電話 スクリプト",
    description:
      "電話でのクレーム対応スクリプトをAIが生成。話し方のコツ付き。新人でもプロ品質の電話対応が可能に。",
    features: [
      {
        icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
        title: "電話対応に特化",
        text: "開始の挨拶→傾聴→謝罪→解決策提示→クロージングまで、電話の流れに沿ったスクリプトを生成。",
      },
      {
        icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
        title: "話し方のコツ付き",
        text: "声のトーン・間の取り方・NGワードなど、電話対応のプロが実践するテクニックも解説。",
      },
      {
        icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        title: "エスカレーション判断",
        text: "上司への引き継ぎが必要なタイミングと引き継ぎスクリプトも自動生成。判断に迷いません。",
      },
    ],
    faqs: [
      {
        q: "クレーム電話で最初に何を言えばいい？",
        a: "まず「お電話ありがとうございます」と受け、「ご不快な思いをさせてしまい申し訳ございません」と共感・謝罪を示します。クレームAIが状況別の開始スクリプトを生成します。",
      },
      {
        q: "怒っているお客様への電話対応のコツは？",
        a: "まず傾聴に徹し、相槌を打ちながら感情を受け止めます。反論せず、事実確認は感情が落ち着いてから行います。AIが感情温度に応じた対応スクリプトを生成します。",
      },
      {
        q: "電話対応の録音は法的に問題ない？",
        a: "通話録音は事前告知があれば合法です（「品質向上のため録音させていただきます」等）。カスハラ対策の証拠保全としても有効です。",
      },
    ],
  },
  "monster-customer-taiou": {
    title: "モンスターカスタマー対応｜理不尽なクレームに法的根拠付きで対応",
    h1: "モンスターカスタマー 対応",
    description:
      "理不尽なクレームへの対応文もAIが法的根拠付きで生成。カスハラ判定・毅然とした断り文・証拠保全の方法まで。",
    features: [
      {
        icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
        title: "カスハラ自動判定",
        text: "厚労省ガイドラインに基づき、正当クレームとカスハラを自動判定。対応方針を明確化。",
      },
      {
        icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
        title: "法的根拠付き断り文",
        text: "民法・刑法（脅迫罪・強要罪・威力業務妨害罪）に基づいた毅然とした断り文を生成。",
      },
      {
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        title: "証拠保全テンプレート",
        text: "通話録音・メール保存・対応記録など、法的措置に備えた証拠保全の方法とテンプレートを提供。",
      },
    ],
    faqs: [
      {
        q: "モンスターカスタマーと正当なクレームの見分け方は？",
        a: "要求内容の正当性と手段の不当性（暴言・脅迫・長時間拘束・土下座要求等）で判断します。クレームAIが厚労省ガイドラインに基づいて自動判定します。",
      },
      {
        q: "カスハラに対して法的措置は取れますか？",
        a: "はい。脅迫罪（刑法222条）・強要罪（刑法223条）・威力業務妨害罪（刑法234条）・名誉毀損罪（刑法230条）等が適用される可能性があります。AIが該当する法的根拠を提示します。",
      },
      {
        q: "2026年カスハラ義務化で企業は何をすべき？",
        a: "改正労働施策総合推進法により、カスハラ対策方針の策定・マニュアル整備・従業員研修・相談窓口の設置が義務化されます。クレームAIで義務化対応を効率的に進められます。",
      },
    ],
  },
  "claim-taiou-kenshu": {
    title: "クレーム対応 研修｜AIで研修コスト削減。新人でもプロ品質",
    h1: "クレーム対応 研修",
    description:
      "新人でもプロ品質。AIクレーム対応で研修コスト削減。実践的なロールプレイ教材をAIが自動生成。",
    features: [
      {
        icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
        title: "研修教材を自動生成",
        text: "業種・クレーム種類別の研修教材をAIが自動作成。ロールプレイ台本・チェックリスト付き。",
      },
      {
        icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
        title: "研修コスト大幅削減",
        text: "外部講師不要。AIが最新の法改正・事例を反映した研修教材を何度でも生成。コスト90%削減。",
      },
      {
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        title: "スキル可視化",
        text: "研修後の理解度チェックリストで、スタッフのクレーム対応スキルを可視化・管理。",
      },
    ],
    faqs: [
      {
        q: "クレーム対応研修の頻度はどのくらいが適切？",
        a: "新入社員は入社時必須、全従業員は年2回以上が推奨です。2026年カスハラ義務化により、定期的な研修実施の記録保管も必要になります。",
      },
      {
        q: "外部講師の研修と比べてAI研修のメリットは？",
        a: "コスト（外部講師:50-100万円→AI:月額2,980円）・即時性（最新事例を即反映）・個別化（業種・レベル別にカスタマイズ）の3点で圧倒的に優れています。",
      },
      {
        q: "研修記録は義務化対応の証拠になりますか？",
        a: "はい。クレームAIで生成した研修教材と実施記録は、カスハラ義務化対応の証拠書類として保存・提出できます。",
      },
    ],
  },
  "ayamari-mail-template": {
    title: "お詫びメール テンプレート｜AIが状況に合わせてカスタマイズ",
    h1: "お詫び メール テンプレート",
    description:
      "お詫びメールのテンプレートをAIが状況に合わせてカスタマイズ。納品遅延・品質不良・サービス不備など。",
    features: [
      {
        icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
        title: "状況別テンプレート",
        text: "納品遅延・品質不良・サービス不備・誤請求・情報漏洩など、あらゆる状況のお詫びメールに対応。",
      },
      {
        icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
        title: "カスタマイズ自在",
        text: "相手との関係性（取引先・顧客・社内）や深刻度に応じて、文面を自動カスタマイズ。",
      },
      {
        icon: "M5 13l4 4L19 7",
        title: "ビジネスマナー完璧",
        text: "件名・宛名・時候の挨拶・結びの言葉まで、ビジネスマナーに完全準拠したメールを生成。",
      },
    ],
    faqs: [
      {
        q: "お詫びメールで絶対に入れるべき要素は？",
        a: "謝罪の言葉・問題の経緯説明・原因・対応策・再発防止策・今後のお願いの6要素が必須です。クレームAIはこれらを自動的に盛り込んだメールを生成します。",
      },
      {
        q: "お詫びメールのタイミングはいつが適切？",
        a: "問題発覚後24時間以内が原則です。詳細調査に時間がかかる場合は、まず第一報のお詫びメールを送り、調査完了後に詳細報告メールを送ります。",
      },
      {
        q: "社外向けと社内向けでテンプレートは違う？",
        a: "はい。社外向けは敬語レベルが高く、法的リスクを考慮した表現になります。社内向けはより具体的な原因分析と再発防止策に重点を置きます。AIが自動で切り替えます。",
      },
    ],
  },
};

const ALL_SLUGS = Object.keys(KEYWORDS);

/* ------------------------------------------------------------------ */
/*  Static params                                                      */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

const SITE_URL = "https://claim-ai.vercel.app";

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const kw = KEYWORDS[params.slug];
  if (!kw) return {};
  return {
    title: kw.title,
    description: kw.description,
    openGraph: {
      title: kw.title,
      description: kw.description,
      url: `${SITE_URL}/keywords/${params.slug}`,
      siteName: "AIクレーム対応文ジェネレーター",
      locale: "ja_JP",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: kw.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: kw.title,
      description: kw.description,
      images: ["/og.png"],
    },
    alternates: {
      canonical: `${SITE_URL}/keywords/${params.slug}`,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Icon component                                                     */
/* ------------------------------------------------------------------ */

function FeatureIcon({ d }: { d: string }) {
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20 shrink-0">
      <svg
        className="w-6 h-6 text-blue-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={d} />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function KeywordPage({
  params,
}: {
  params: { slug: string };
}) {
  const kw = KEYWORDS[params.slug];
  if (!kw) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: kw.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main
        className="min-h-screen text-white"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(37,99,235,0.08) 0%, transparent 50%), #0B0F1E",
        }}
      >
        {/* ── Hero ── */}
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
          <p className="text-blue-400 text-sm font-medium tracking-wider mb-4">
            AIクレーム対応文ジェネレーター
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #BFDBFE, #FFFFFF, #C7D2FE)",
            }}
          >
            {kw.h1}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: "rgba(147,197,253,0.8)" }}>
            {kw.description}
          </p>
          <Link
            href="/tool"
            className="inline-flex items-center gap-2 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #818CF8)",
              boxShadow:
                "0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(129,140,248,0.15)",
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            無料で対応文を生成する
          </Link>
          <p className="text-xs mt-3" style={{ color: "rgba(147,197,253,0.5)" }}>
            登録不要・クレジットカード不要・無料3回
          </p>
        </section>

        {/* ── Features ── */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-center mb-8 text-white/90">
            特長
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {kw.features.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <FeatureIcon d={f.icon} />
                <h3 className="font-bold mt-4 mb-2 text-white/90">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(147,197,253,0.7)" }}>
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-center mb-8 text-white/90">
            よくある質問
          </h2>
          <div className="space-y-4">
            {kw.faqs.map((f, i) => (
              <details
                key={i}
                className="rounded-2xl border border-white/10 backdrop-blur-sm group"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <summary className="cursor-pointer px-6 py-4 font-medium text-white/90 flex items-center justify-between list-none">
                  {f.q}
                  <svg
                    className="w-5 h-5 text-blue-400 transition-transform group-open:rotate-180 shrink-0 ml-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-6 pb-4 text-sm leading-relaxed" style={{ color: "rgba(147,197,253,0.7)" }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA repeat ── */}
        <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
          <div
            className="rounded-2xl p-8 border border-blue-500/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(129,140,248,0.05))",
            }}
          >
            <h2 className="text-xl font-bold mb-3 text-white/90">
              今すぐクレーム対応文を生成
            </h2>
            <p className="text-sm mb-6" style={{ color: "rgba(147,197,253,0.7)" }}>
              クレーム内容を入力するだけ。AIが最適な対応文を30秒で自動生成します。
            </p>
            <Link
              href="/tool"
              className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #818CF8)",
                boxShadow:
                  "0 0 30px rgba(59,130,246,0.4), 0 0 60px rgba(129,140,248,0.15)",
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              無料で対応文を生成する
            </Link>
          </div>
        </section>

        {/* ── CrossSell ── */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <CrossSell currentService="クレームAI" />
        </section>
      </main>
    </>
  );
}
