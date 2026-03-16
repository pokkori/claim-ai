import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { isActiveSubscription } from "@/lib/supabase";

export const dynamic = "force-dynamic";

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}
const FREE_LIMIT = 3;
const COOKIE_KEY = "claim_use_count";
const APP_ID = "claim-ai";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

const VALID_CLAIM_TYPES = ["商品・品質クレーム", "接客・対応クレーム", "配送・納期クレーム", "請求・料金クレーム", "カスタマーハラスメント", "その他"];
const VALID_SEVERITY = ["low", "medium", "high"];

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "リクエストが多すぎます。しばらく待ってから再試行してください。" }, { status: 429 });
  }
  const email = req.cookies.get("user_email")?.value;
  let isPremium = false;
  if (email) {
    isPremium = await isActiveSubscription(email, APP_ID);
  } else {
    const pv = req.cookies.get("premium")?.value;
    isPremium = pv === "1" || pv === "biz";
  }
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || "0");
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 }); }

  const { claimType, situation, severity } = body as Record<string, string>;
  if (!situation || !situation.trim()) return NextResponse.json({ error: "状況を入力してください" }, { status: 400 });
  if (situation.length > 1500) return NextResponse.json({ error: "状況は1500文字以内で入力してください" }, { status: 400 });
  if (claimType && !VALID_CLAIM_TYPES.includes(claimType)) return NextResponse.json({ error: "不正なクレーム種別です" }, { status: 400 });
  if (severity && !VALID_SEVERITY.includes(severity)) return NextResponse.json({ error: "不正な深刻度です" }, { status: 400 });

  const safSituation = situation.replace(/[<>]/g, "");

  const severityLabel = severity === "high" ? "重度" : severity === "low" ? "軽度" : "中度";
  const severityGuidance =
    severity === "high"
      ? "法的措置・SNS拡散・消費者センター通報など重大なリスクを伴う可能性があります。毅然とした対応と証拠保全を優先してください。"
      : severity === "low"
      ? "軽微なご不満・改善要望レベルです。誠実な謝意と具体的な改善策の提示を中心としてください。"
      : "一般的なクレームです。誠実に事実確認を行い、対応策を明確に示してください。";

  const prompt = `あなたは企業のカスタマーサポート対応の専門家です。15年以上の現場経験を持ち、消費者契約法・民法・不正競争防止法・カスタマーハラスメント対策指針（厚労省）を熟知しています。
一般企業（BtoC・小売・飲食・サービス業）のCS担当者がそのままコピーして使用できる、プロ品質の対応文一式を生成してください。

【クレーム種別】${claimType || "その他"}
【深刻度】${severityLabel}
【状況の詳細】
${safSituation}

【対応方針】
${severityGuidance}

以下の3種類の対応文を生成してください。各対応文は「---」（ハイフン3つのみの行）で区切ってください。

---
## 口頭・電話対応スクリプト

CS担当者が読み上げるセリフ形式で、400〜600文字で生成してください。

【必須要素】
- 冒頭：受け止めの言葉（感謝よりも先に「おわび」を。「ご不便をおかけし、大変申し訳ございません」等）
- 状況の確認と傾聴姿勢（「おっしゃる通りでございます」「ご状況を詳しくお聞かせいただけますでしょうか」等）
- 謝罪すべき点（自社の落ち度）と謝罪しない点（事実無根・要求過剰）を明確に区別
- 具体的な次のアクション（「本日中に○○部へ確認し、△△日までにご連絡いたします」等の期日明示）
- 深刻度「重度」の場合：上長・専門部署へのエスカレーション案内を含める
- カスタマーハラスメント（暴言・脅迫）の場合：「お申し出の内容については真摯に受け止めますが、威圧的な言動については対応が困難となります」等の毅然とした文言

【文体】敬語・丁寧語を徹底。箇条書き禁止（流れるセリフ形式）。読み上げやすい文節で区切る。

---
## 書面・通知文

企業名義の正式文書として400〜600文字で生成してください。

【必須要素】
- 文書冒頭に日付・宛名・差出人のプレースホルダー（例：令和　　年　　月　　日 / ○○様 / ○○株式会社 代表取締役 ○○）
- 件名（例：「○○に関するご申告へのご回答について」）
- 第1段落：事実の確認と誠意ある受け止め（「このたびはご不便・ご不快をおかけし、誠に申し訳ございません」等）
- 第2段落：調査・確認の経緯と判明した事実（客観的記述。「弊社にて調査いたしました結果、〜であることが確認されました」等）
- 第3段落：再発防止策・具体的な対応内容（曖昧な「検討します」は禁止。「○月末までに○○を実施いたします」等の期日・具体策を明記）
- 深刻度「重度」の場合：「今後同様の行為が継続する場合、誠に遺憾ながら法的措置を検討せざるを得ない旨、申し添えます」等の警告文言
- 末尾：担当者名・問い合わせ先・電話番号のプレースホルダー

【文体】公用文体（「ます・です」調）。段落は一行空けで区切る。「拝啓・敬具」等の頭語・結語を使用。

---
## インシデント記録テンプレート

社内保管・法的対応・監査に耐えうる客観的記述で生成してください。感情・主観は排除し事実のみを記録する形式で出力してください。

【必須フィールド（全項目を状況に合わせて埋めること）】
- 記録番号：INC-YYYYMMDD-（連番）
- 記録日時：
- 対応者氏名・部署・役職：
- クレーム受付日時：　　受付方法（電話 / メール / 来店 / SNS等）：
- 申告者情報（氏名・連絡先・会員番号等。不明の場合は「取得不可」と記載）：
- クレーム種別：　　深刻度（低 / 中 / 高）：
- クレーム内容（事実のみ・5W1Hで記述）：
- 申告者の具体的要求事項：
- 対応経緯（時系列で箇条書き。日時・対応者・内容）：
  - ○月○日 ○時：
  - ○月○日 ○時：
- 今回の対応結果・合意内容：
- 今後の対応方針・担当者・期限：
- 証拠・資料の保管場所・ファイル名：
- 法的リスク評価（低 / 中 / 高）・理由：
- 再発防止措置・提言：
- 承認者氏名・承認日：

---
※ 本ツールが生成する対応文はAIによる参考案です。法的効力を持つものではありません。重大なクレームや法的問題が生じた場合は必ず専門家（弁護士）にご相談ください。`;

  // クレームレベルを評価（ルールベース判定）
  function assessLevel(content: string, sev: string): { level: "軽度" | "中度" | "重度"; color: "green" | "yellow" | "red"; reason: string } {
    if (sev === "high") {
      const legalKeywords = ["弁護士", "訴訟", "裁判", "警察", "消費者センター", "SNS", "拡散", "炎上", "訴える", "詐欺", "返金しろ", "謝罪しろ"];
      const hasLegal = legalKeywords.some(w => content.includes(w));
      return { level: "重度", color: "red", reason: hasLegal ? "法的措置・拡散リスクのキーワードあり" : "深刻度：重度が指定されています" };
    }
    if (sev === "low") {
      return { level: "軽度", color: "green", reason: "一般的な改善要望レベル" };
    }
    const severeKeywords = ["弁護士", "訴訟", "裁判", "警察", "消費者センター", "SNS", "拡散", "炎上", "訴える", "詐欺"];
    const moderateKeywords = ["ひどい", "最悪", "二度と", "不満", "怒", "許せない", "がっかり", "カスハラ"];
    if (severeKeywords.some(w => content.includes(w))) return { level: "重度", color: "red", reason: "法的措置・拡散リスクのキーワードあり" };
    if (moderateKeywords.some(w => content.includes(w))) return { level: "中度", color: "yellow", reason: "強い不満のキーワードあり" };
    return { level: "中度", color: "yellow", reason: "通常クレームレベル" };
  }

  const levelInfo = assessLevel(safSituation, severity || "medium");

  try {
    const newCount = cookieCount + 1;
    const stream = getClient().messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3500,
      messages: [{ role: "user", content: prompt }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          // メタ情報をJSONで末尾に送信
          const meta = JSON.stringify({ count: newCount, level: levelInfo });
          controller.enqueue(encoder.encode(`\nDONE:${meta}`));
          controller.close();
        } catch (err) {
          console.error(err);
          controller.error(err);
        }
      },
    });

    const res = new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Set-Cookie": `${COOKIE_KEY}=${newCount}; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax; HttpOnly; Secure; Path=/`,
      },
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI生成中にエラーが発生しました。しばらく待ってから再試行してください。" }, { status: 500 });
  }
}
