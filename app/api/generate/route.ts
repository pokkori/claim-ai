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
  const isPremium = req.cookies.get("stripe_premium")?.value === "1";
  const cookieCount = parseInt(req.cookies.get(COOKIE_KEY)?.value || "0");
  if (!isPremium && cookieCount >= FREE_LIMIT) {
    return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 }); }

  const { industry, situation, claimContent, severity, tone } = body as Record<string, string>;
  if (!claimContent) return NextResponse.json({ error: "クレーム内容は必須です" }, { status: 400 });
  if (claimContent.length > 1000) return NextResponse.json({ error: "クレーム内容は1000文字以内で入力してください" }, { status: 400 });

  const toneGuide =
    tone === "毅然"
      ? "感情的にならず毅然とした姿勢で対応。謝り過ぎず事実を明確に伝え、再発防止策を論理的に示す。「大変ご迷惑をおかけしました」程度の謝罪にとどめ、過度な謝罪は避ける。"
      : tone === "強硬"
      ? "法的根拠・消費者契約法・業界規制を踏まえ毅然と対応。不当要求には明確に断る文言を含める。必要に応じ「法的対応を含む適切な措置を取らせていただく場合がある」旨を示唆。過度な謝罪は不要。"
      : "誠実で丁寧な謝罪を中心に、お客様の気持ちに寄り添う温かみある対応。「心よりお詫び申し上げます」など真摯な謝罪表現を使用。";

  const severityGuide =
    severity === "重大"
      ? "法的リスク・風評被害・SNS拡散を考慮し、責任者名義・具体的な補償提示を含む最上級の対応文を作成。対応の速さと誠実さを最大限示す。"
      : severity === "軽微"
      ? "簡潔で温かみのある対応文を作成。過度な謝罪は避け、迅速な解決を示す。"
      : "誠実かつプロフェッショナルな標準的対応文を作成。";

  const industryContext = industry
    ? `${industry}業界の慣習・専門用語・よくある補償内容を踏まえた対応文にすること。`
    : "";

  const prompt = `あなたはクレーム対応の第一人者コンサルタントです。20年の経験を持ち、大手企業のCS部門を指導してきた専門家として、以下のクレームに対する完全な対応セットを作成してください。

【クレーム情報】
業種: ${industry || "一般"}
状況: ${situation || "店舗・サービスへのクレーム"}
クレーム内容: ${claimContent}
深刻度: ${severity || "通常"}

【対応方針】
${severityGuide}
${industryContext}
トーン: ${toneGuide}

以下の構成で出力してください。各セクションの区切りは必ず「---」（ハイフン3つのみの行）を使ってください：

---
## 📧 メール返信文（そのまま使えるバージョン）

件名: 【重要】${situation || "ご指摘"}についてのご連絡

（宛名）様

（本文：①お詫び→②状況確認と原因→③再発防止策→④補償・対応策→⑤今後の対応→⑥締め）

敬具

株式会社〇〇
担当: 〇〇 〇〇
TEL: 000-0000-0000

---
## 📞 電話対応スクリプト

**【冒頭・第一声】**
（お客様が電話に出た瞬間の言葉。謝罪と自己紹介を含む）

**【状況確認フェーズ】**
（怒りが少し落ち着いたタイミングで確認すべき質問。3〜4点）

**【解決提案フェーズ】**
（具体的に提示する補償・対応内容）

**【想定されるお客様の反応への切り返し】**
・「SNSに投稿する」と言われた場合:
・「慰謝料を請求する」と言われた場合:
・「二度と来ない」と言われた場合:

**【クロージング】**
（感謝と今後の関係継続への言葉）

---
## ✅ 対応チェックリスト

**■ 初動対応（発生から1時間以内）**
- [ ]
- [ ]
- [ ]

**■ 情報収集・原因究明（当日中）**
- [ ]
- [ ]

**■ 再発防止（3日以内）**
- [ ]
- [ ]
${severity === "重大" ? "\n**■ エスカレーション対応**\n- [ ] 法務・上長への報告\n- [ ] 補償・返金の承認取得\n- [ ] 広報・SNS監視体制の確認" : ""}

---
## 💡 このクレームを顧客満足に変えるポイント

（このクレームをリピーター獲得のチャンスに変える具体的なアドバイスを3点。それぞれ「なぜ効果があるか」の理由も添えて。）

---
※ 実際の状況に応じて文言を調整してご使用ください。`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const newCount = cookieCount + 1;
    const res = NextResponse.json({ result: text, count: newCount });
    res.cookies.set(COOKIE_KEY, String(newCount), { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", httpOnly: true, secure: true });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI生成中にエラーが発生しました。しばらく待ってから再試行してください。" }, { status: 500 });
  }
}
