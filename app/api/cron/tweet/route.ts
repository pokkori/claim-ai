import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TWEET_TOPICS = [
  "飲食店でよくあるクレームと対応のコツ",
  "EC・通販で多い配送トラブルへの対応法",
  "接客態度のクレームを顧客満足に変える方法",
  "商品不良クレームで信頼を取り戻す対応術",
  "予約ミス・キャンセルトラブルの上手な収め方",
  "料金トラブルを穏便に解決するコミュニケーション術",
  "クレーム対応で絶対やってはいけないNG言葉",
  "電話クレームで使える冒頭の第一声フレーズ集",
  "モンスタークレーマーへの毅然とした対応法",
  "クレームをリピーター獲得のチャンスに変える方法",
  "美容院・サロンでよくあるクレームと解決策",
  "ホテル・旅館のクレーム対応で押さえるべきポイント",
];

async function generateTweetContent(topic: string): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = `あなたはクレーム対応の専門家です。X（旧Twitter）向けに、飲食店オーナー・EC事業者・サービス業の経営者に役立つ投稿を作成してください。

テーマ: ${topic}

条件:
- 140文字以内（日本語）
- 実践的なTips形式（「〇〇するだけで〜」「〜の場合は〜」など）
- ハッシュタグを2〜3個含める（#クレーム対応 #CS #接客）
- 改行を使って読みやすく
- 最後に「👇AIクレーム対応文を無料で試せます」のような軽いCTAを含めてよい（任意）

本文のみ出力してください。`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });
  return message.content[0].type === "text" ? message.content[0].text.trim() : "";
}

async function postTweet(text: string): Promise<{ id: string }> {
  const { TwitterApi } = await import("twitter-api-v2");
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  });
  const tweet = await client.v2.tweet(text);
  return { id: tweet.data.id };
}

export async function GET(req: NextRequest) {
  // Vercel Cron認証
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const topic = TWEET_TOPICS[Math.floor(Math.random() * TWEET_TOPICS.length)];
    const tweetText = await generateTweetContent(topic);
    if (!tweetText) throw new Error("Empty tweet content");

    const result = await postTweet(tweetText);
    console.log(`[cron/tweet] Posted: ${result.id} | Topic: ${topic}`);
    return NextResponse.json({ ok: true, id: result.id, topic });
  } catch (err) {
    console.error("[cron/tweet] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
