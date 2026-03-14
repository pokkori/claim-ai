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

  const prompt = `あなたは企業のカスタマーサポート対応の専門家です。
消費者契約法・民法・不正競争防止法など関連法規を踏まえ、一般企業（BtoC・小売・飲食・サービス業）のCS担当者が
そのまま使用できる対応文一式を生成してください。

【クレーム種別】${claimType || "その他"}
【深刻度】${severityLabel}
【状況の詳細】
${safSituation}

【対応方針】
${severityGuidance}

以下の3種類の対応文を生成してください。各対応文は「---」（ハイフン3つのみの行）で区切ってください。

---
## 口頭・電話対応スクリプト

- CS担当者が直接伝えるための具体的なセリフ形式
- 冷静・丁寧かつ毅然としたトーン
- 謝罪すべき点と謝罪しない点を明確に区別する
- 深刻度「重度」の場合は上長エスカレーションの案内を含める

---
## 書面・通知文

- 企業名義の公式文書として使用できる文体
- 事実確認・対応方針・今後の対処を明記
- 深刻度「重度」の場合は警告・法的措置への言及を適切に含める
- 宛名・差出人・日付のプレースホルダーを含める

---
## インシデント記録テンプレート

- 日時・対応者・クレーム内容・対応経緯・対応結果を記録する形式
- 将来の法的対応・社内報告・再発防止に活用できる客観的記述
- 記入すべき項目を明示し、そのまま使用できるフォーマットで出力する

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
    const message = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const newCount = cookieCount + 1;
    const res = NextResponse.json({ result: text, count: newCount, level: levelInfo });
    res.cookies.set(COOKIE_KEY, String(newCount), { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", httpOnly: true, secure: true });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI生成中にエラーが発生しました。しばらく待ってから再試行してください。" }, { status: 500 });
  }
}
