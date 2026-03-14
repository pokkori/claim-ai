import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const PAYJP_API = "https://api.pay.jp/v1";

function payjpAuth() {
  return "Basic " + Buffer.from(process.env.PAYJP_SECRET_KEY! + ":").toString("base64");
}

async function checkSubscriptionActive(subId: string): Promise<boolean> {
  try {
    const res = await fetch(`${PAYJP_API}/subscriptions/${subId}`, {
      headers: { Authorization: payjpAuth() },
    });
    const data = await res.json();
    return data.status === "active" || data.status === "trial";
  } catch {
    return true; // エラー時は維持（API障害でアクセスを止めない）
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const premium = cookieStore.get("premium")?.value;
  if (!premium) return NextResponse.json({ isPremium: false });

  const subId = cookieStore.get("payjp_sub_id")?.value;
  if (subId) {
    const isActive = await checkSubscriptionActive(subId);
    if (!isActive) {
      const res = NextResponse.json({ isPremium: false });
      res.cookies.set("premium", "", { maxAge: 0, path: "/" });
      res.cookies.set("payjp_sub_id", "", { maxAge: 0, path: "/" });
      return res;
    }
  }

  return NextResponse.json({ isPremium: true, plan: premium });
}
