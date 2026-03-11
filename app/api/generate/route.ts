import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { isActiveSubscription } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const FREE_LIMIT = 3;
const COOKIE_KEY = "review_use_count";
const APP_ID = "google-review";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) { rateLimit.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

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
    isPremium = req.cookies.get("premium")?.value === "1" || req.cookies.get("stripe_premium")?.value === "1" || req.cookies.get("premium")?.value === "biz";
  }
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || "0");
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 }); }

  const { industry, rating, reviewContent, tone } = body as Record<string, string>;
  if (!reviewContent) return NextResponse.json({ error: "口コミ内容は必須です" }, { status: 400 });
  if (reviewContent.length > 1000) return NextResponse.json({ error: "口コミ内容は1000文字以内で入力してください" }, { status: 400 });
  // allowlist: tone は列挙値のみ許可
  const VALID_TONES = ["プロ", "親しみ", "丁寧"];
  if (tone && !VALID_TONES.includes(tone)) return NextResponse.json({ error: "不正なトーン値です" }, { status: 400 });
  // industry は任意入力だが最大50文字・制御文字禁止
  const safIndustry = (industry ?? "").replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 50);

  const ratingNum = parseInt(rating?.replace("★", "") || "3");
  const isLowRating = ratingNum <= 2;
  const isHighRating = ratingNum >= 4;

  const toneGuide =
    tone === "プロ"
      ? "プロフェッショナルで簡潔な文体。冗長な表現を避け、要点を的確に伝える。信頼感と誠実さを醸成する。"
      : tone === "親しみ"
      ? "温かみがあり、親しみやすい文体。お客様との距離を縮め、また来店したくなるような雰囲気を作る。"
      : "丁寧で誠実な謝意を示す文体。お客様を大切にしている姿勢が伝わる言葉を選ぶ。";

  const ratingContext = isLowRating
    ? "低評価（★1〜2）の口コミです。まず誠実にお詫びし、具体的な改善策を示し、個別対応の意志を見せることが重要です。"
    : isHighRating
    ? "高評価（★4〜5）の口コミです。感謝の気持ちを伝えつつ、他のお客様にも訴求する内容にすることが重要です。"
    : "中評価（★3）の口コミです。良かった点への感謝と、課題への誠実な改善意欲を示すことが重要です。";

  const industryContext = safIndustry
    ? `${safIndustry}業界の慣習・専門用語を踏まえた返信文にすること。`
    : "";

  const prompt = `あなたはGoogleビジネスプロフィールの口コミ対応の専門家です。店舗のオーナーとして、以下のGoogle口コミに対する最適な返信文セットを作成してください。

【口コミ情報】
業種: ${safIndustry || "一般店舗"}
評価: ${rating || "★3"}
口コミ内容: ${reviewContent}

【対応方針】
${ratingContext}
${industryContext}
トーン: ${toneGuide}

以下の構成で出力してください。各セクションの区切りは必ず「---」（ハイフン3つのみの行）を使ってください：

---
## 💬 返信文（Googleに投稿する返信文）

（${isLowRating ? "①感謝→②お詫び→③具体的な改善策→④個別対応の案内→⑤再来店の促し" : "①感謝→②具体的な共感→③店舗の魅力・強みへの言及→④今後もよろしくお願いします"}の流れで200〜300文字程度）

---
## 🌟 感謝文（高評価をいただいた場合の追加感謝メッセージ）

${isHighRating ? "（口コミ内容の具体的な点に触れながら、スタッフへの感謝や今後の抱負を300文字程度で）" : "（仮に高評価をいただいた場合の返信文テンプレートを300文字程度で作成。次回来店時に高評価をいただけるよう改善後を想定して）"}

---
## 📈 SEOアドバイス（Googleマップ検索での露出を高めるためのポイント）

**返信文に含めると効果的なキーワード：**
（業種・地域・サービス名など検索されやすいキーワードを3〜5個）

**SEO的に有効な返信のコツ：**
（具体的なアドバイスを3点）

**この口コミへの返信で期待できる効果：**
（集客・信頼性向上への影響を説明）

---
## ✏️ 別パターン（文体・長さの異なる返信例）

**【短め・シンプル版】（100文字以内）**
（簡潔にお礼・お詫びを伝えるバージョン）

**【丁寧・詳細版】（400文字程度）**
（より丁寧に、具体的な対応策を示すバージョン）

---
※ 店舗名・担当者名は実際のものに変更してご使用ください。`;

  // クレームレベルを評価（APIコールなしでルールベース判定）
  function assessLevel(content: string, ratingNum: number): { level: "軽度" | "中度" | "重度"; color: "green" | "yellow" | "red"; reason: string } {
    const severe = ["弁護士", "訴訟", "裁判", "警察", "消費者センター", "SNS", "拡散", "炎上", "訴える", "詐欺", "返金しろ", "謝罪しろ", "カスハラ"];
    const moderate = ["ひどい", "最悪", "二度と", "クレーム", "不満", "怒", "許せない", "がっかり"];
    const hasSevere = severe.some(w => content.includes(w));
    const hasModerate = moderate.some(w => content.includes(w));
    if (ratingNum <= 1 || hasSevere) return { level: "重度", color: "red", reason: hasSevere ? "法的措置・拡散リスクのキーワードあり" : "最低評価（★1）" };
    if (ratingNum <= 2 || hasModerate) return { level: "中度", color: "yellow", reason: hasModerate ? "強い不満のキーワードあり" : "低評価（★2）" };
    return { level: "軽度", color: "green", reason: "一般的な改善要望レベル" };
  }

  const levelInfo = assessLevel(reviewContent, ratingNum);

  try {
    const message = await client.messages.create({
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
