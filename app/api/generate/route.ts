import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const FREE_LIMIT = 3;
const COOKIE_KEY = "claim_use_count";

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
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || "0");
  if (cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 }); }

  const { industry, situation, claimContent, severity } = body as Record<string, string>;
  if (!claimContent) return NextResponse.json({ error: "クレーム内容は必須です" }, { status: 400 });

  const prompt = `あなたはクレーム対応の専門家です。以下のクレームに対して、誠実かつ丁寧な対応文を作成してください。

業種: ${industry || "一般"}
状況: ${situation || "店舗・サービスへのクレーム"}
クレーム内容: ${claimContent}
深刻度: ${severity || "通常"}

以下の構成で対応文を作成してください：

【お詫び文】
（誠実な謝罪と共感を示す文）

【状況の説明・原因】
（わかりやすい説明、言い訳にならないように）

【再発防止策】
（具体的な改善策を提示）

【締めの言葉】
（感謝と今後への言及）

ポイント：
- 感情的にならず冷静に
- お客様の気持ちに寄り添う
- 具体的な解決策を示す
- 誠実さが伝わる文体`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const newCount = cookieCount + 1;
    const res = NextResponse.json({ result: text, count: newCount });
    res.cookies.set(COOKIE_KEY, String(newCount), { maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI生成中にエラーが発生しました。しばらく待ってから再試行してください。" }, { status: 500 });
  }
}
