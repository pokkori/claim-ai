// @ts-nocheck
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { claimText } = await req.json();
    if (!claimText) return NextResponse.json({ error: "内容を入力してください" }, { status: 400 });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `あなたは企業の法務・CS専門家です。以下の悪質クレームや不当要求に対して、毅然とした・法的根拠のある・しかし丁寧な「断り文」を生成してください。

【クレーム内容】
${claimText}

【断り文の条件】
- 法的根拠を明示（必要に応じて消費者契約法・特定商取引法・不当要求防止条例を引用）
- 「誠実に対応したが、これ以上は対応できない」という立場を明確に
- 感情的にならず冷静なトーン
- 最後に「今後同様の連絡があった場合は法的措置を検討する」旨を丁寧に記載
- 300〜500文字程度

断り文のみを出力してください。説明は不要です。`,
        },
      ],
    });

    const text = message.content[0]?.type === "text" ? message.content[0].text : "";
    return NextResponse.json({ result: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "生成に失敗しました" }, { status: 500 });
  }
}
