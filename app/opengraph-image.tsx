import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AIクレーム対応文ジェネレーター｜30秒でプロ品質の対応文を自動生成";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 12 }}>🛡️</div>
        <div style={{ fontSize: 52, fontWeight: 700, color: "#38bdf8", marginBottom: 12, textAlign: "center" }}>
          AIクレーム対応文ジェネレーター
        </div>
        <div style={{ fontSize: 26, color: "#e2e8f0", textAlign: "center", maxWidth: 900, lineHeight: 1.5 }}>
          業種・状況・深刻度を入力するだけで
        </div>
        <div style={{ fontSize: 26, color: "#e2e8f0", textAlign: "center", maxWidth: 900, marginBottom: 20 }}>
          メール文＋電話スクリプト＋チェックリストを30秒で自動生成
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          {["飲食店", "ECショップ", "ホテル", "小売・美容"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 20px",
                background: "rgba(56,189,248,0.15)",
                border: "1px solid rgba(56,189,248,0.4)",
                borderRadius: 24,
                fontSize: 18,
                color: "#7dd3fc",
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 32,
            padding: "12px 36px",
            background: "#0369a1",
            borderRadius: 40,
            fontSize: 22,
            color: "#fff",
            fontWeight: 600,
          }}
        >
          無料3回 → ¥4,980/月〜
        </div>
      </div>
    ),
    { ...size }
  );
}
