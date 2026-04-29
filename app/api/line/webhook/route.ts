/**
 * LINE Messaging API Webhook - クレームAI
 * POST /api/line/webhook
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const SERVICE_URL = "https://claim-ai-beryl.vercel.app";
const SERVICE_NAME = "クレームAI";
const APP_ID = "claim-ai";

function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret) return false;
  const hash = crypto
    .createHmac("SHA256", secret)
    .update(rawBody)
    .digest("base64");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

async function sendLineMessage(userId: string, text: string): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) return;
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text }],
    }),
  });
  if (!res.ok) {
    console.error(`[LINE] push failed: ${res.status} ${await res.text()}`);
  }
}

async function registerLineUser(userId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const nextSendAt = new Date();
  nextSendAt.setDate(nextSendAt.getDate() + 1);

  const { error } = await supabase.from("line_step_users").upsert(
    {
      line_user_id: userId,
      app_id: APP_ID,
      step: 0,
      next_send_at: nextSendAt.toISOString(),
      created_at: new Date().toISOString(),
    },
    { onConflict: "line_user_id,app_id" }
  );
  if (error) console.error("[LINE] Supabase upsert error:", error.message);
}

const DAY0_MESSAGE = `【${SERVICE_NAME}】にご登録ありがとうございます。

カスハラ・クレーム対応の適切なスクリプトと記録書類をAIが即座に生成します。

まず無料でお試しください:
${SERVICE_URL}

対応に困ったときはいつでもこのLINEにメッセージをどうぞ。`;

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature") ?? "";

  if (!signature || !verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let parsed: { events?: LineEvent[] };
  try {
    parsed = JSON.parse(rawBody) as { events?: LineEvent[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  for (const event of parsed.events ?? []) {
    if (event.type === "follow" && event.source?.userId) {
      await Promise.allSettled([
        sendLineMessage(event.source.userId, DAY0_MESSAGE),
        registerLineUser(event.source.userId),
      ]);
    }
  }

  return NextResponse.json({ ok: true });
}

interface LineEvent {
  type: string;
  source?: { userId?: string };
}
