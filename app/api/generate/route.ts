import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { isActiveSubscription } from "@/lib/supabase";
import { createErrorResponse, getClaudeErrorMessage } from "@/lib/claude-error";

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
const VALID_INDUSTRIES = ["飲食店", "EC・通販", "美容・サロン", "ホテル・旅館", "小売店", "医療・介護", "IT・SaaS", "コールセンター", "その他"];
const VALID_SEVERITY = ["low", "medium", "high", "軽度", "中度", "重度"];
const SEVERITY_MAP: Record<string, string> = { "軽度": "low", "中度": "medium", "重度": "high" };

const systemPrompt = `あなたは企業のカスタマーサポート対応の専門家です。15年以上の現場経験を持ち、消費者契約法・民法・不正競争防止法・景品表示法・製造物責任法（PL法）・カスタマーハラスメント対策指針（厚労省2023年改訂版）を熟知しています。
大手小売業・飲食チェーン・ECサイト運営会社・ホテル・IT企業など150社以上のクレーム対応体制構築を支援してきた実績があります。

## 出力の絶対ルール

1. **即使えるコピペ文を必ず含める**
   - 口頭・電話対応スクリプト / 書面・通知文 / インシデント記録テンプレートの3種類を必ず出力する
   - 社名・氏名・日付は「（株式会社〇〇）」「（山田 太郎）」形式のプレースホルダーで示す
   - ユーザーが空欄を埋めるだけで使える完成度にする

2. **リスクの根拠を法的根拠で示す**
   - 該当する法律・条文を明示する（例: 消費者契約法第〇条、民法第〇条）
   - 「リスクが高い」ではなく「〇〇法〇条に抵触する可能性があるため高リスク」と記述する
   - 判例がある場合は「最高裁〇年〇月判決」等を示す（不確かな場合は「類似判例として」と明記）

3. **3段階の選択肢を提示する**（書面通知文に適用）
   - 【A案: 強硬対応】相手への法的効果が最大。ただし関係悪化リスクあり
   - 【B案: 標準対応】実務バランスが最良。多くの場面で推奨
   - 【C案: 穏便対応】関係維持を優先。法的効果は限定的

4. **深刻度を必ずスコアで示す**
   - 法的リスク: 低(1-3) / 中(4-6) / 高(7-9) / 重大(10) で数値化
   - 緊急度: 「即日対応必須」「1週間以内」「余裕あり」の3段階

5. **免責事項と法令基準日**
   - 回答の末尾に「※ 本回答はAIによる参考情報であり、法的助言ではありません。重大なクレームや法的問題は弁護士にご相談ください。2026年3月時点の法令に基づいています。」と記載すること
   - 回答には該当する法律・条文を明示すること（例: 労働基準法第〇条、民法第709条、消費者契約法第〇条）

最後に必ず「## 次の3ステップ」というセクションを追加し、ユーザーが今すぐ取れる具体的な行動を箇条書き（「- 」で始まる）3つ記載してください。各ステップは「〇〇する（例：記録を残す・専門家に相談する・証拠を収集する等）」の形式で書いてください。`;

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

  const { claimType, situation, severity: rawSeverity, replyStyle, industry } = body as Record<string, string>;
  const severity = SEVERITY_MAP[rawSeverity] || rawSeverity;
  if (!situation || !situation.trim()) return NextResponse.json({ error: "状況を入力してください" }, { status: 400 });
  if (situation.length > 1500) return NextResponse.json({ error: "状況は1500文字以内で入力してください" }, { status: 400 });
  if (claimType && !VALID_CLAIM_TYPES.includes(claimType)) return NextResponse.json({ error: "不正なクレーム種別です" }, { status: 400 });
  if (severity && !["low", "medium", "high"].includes(severity)) return NextResponse.json({ error: "不正な深刻度です" }, { status: 400 });
  const safeIndustry = industry && VALID_INDUSTRIES.includes(industry) ? industry : "";
  const VALID_REPLY_STYLES = ["穏便型", "毅然型", "記録型"];
  const safeReplyStyle = replyStyle && VALID_REPLY_STYLES.includes(replyStyle) ? replyStyle : "穏便型";
  const replyStyleGuidance =
    safeReplyStyle === "毅然型"
      ? "【返答スタイル: 毅然型】事実を客観的かつ明確に伝え、不当な要求や過剰なクレームには毅然とした姿勢で対応してください。法的根拠を示しつつ、感情的にならず断固たる文言を使用してください。"
      : safeReplyStyle === "記録型"
      ? "【返答スタイル: 記録型】証拠保全とエスカレーション準備を最優先にした対応文を生成してください。記録の正確性・客観性を重視し、将来の法的対応・第三者への報告に耐えうる文書品質を確保してください。"
      : "【返答スタイル: 穏便型】まず誠実な謝罪と共感を示し、顧客との関係維持を最優先にした対応文を生成してください。温かみのある言葉遣いで、解決への誠意を最大限に伝えてください。";

  const safSituation = situation.replace(/[<>]/g, "");

  const severityLabel = severity === "high" ? "重度" : severity === "low" ? "軽度" : "中度";
  const severityGuidance =
    severity === "high"
      ? "法的措置・SNS拡散・消費者センター通報など重大なリスクを伴う可能性があります。毅然とした対応と証拠保全を優先してください。"
      : severity === "low"
      ? "軽微なご不満・改善要望レベルです。誠実な謝意と具体的な改善策の提示を中心としてください。"
      : "一般的なクレームです。誠実に事実確認を行い、対応策を明確に示してください。";

  const prompt = `あなたは企業のカスタマーサポート対応の専門家です。15年以上の現場経験を持ち、消費者契約法・民法・不正競争防止法・景品表示法・製造物責任法（PL法）・カスタマーハラスメント対策指針（厚労省2023年改訂版）を熟知しています。大手小売業・飲食チェーン・ECサイト運営会社・ホテル・IT企業など150社以上のクレーム対応体制構築を支援してきた実績があります。SNS炎上・消費者センター通報・弁護士案件に発展したクレームを含め、全件で適切に解決した実績があります。

一般企業（BtoC・小売・飲食・サービス業）のCS担当者がそのままコピーして使用できる、プロ品質の対応文一式を生成してください。

【重要な品質基準】
- 各対応文は必ず指定文字数を満たすこと（短縮禁止）
- 抽象的・曖昧な表現（「速やかに対応します」「検討いたします」等）は禁止。必ず具体的な期日・数値・固有名詞を入れること
- 業界標準の敬語・ビジネス語彙を使用すること（例：「申し出」→「ご申告」、「確認する」→「精査いたします」）
- 実例・具体的シナリオを盛り込むこと（例：「商品到着から3営業日以内に代替品を発送いたします」等の実践的な文言）

【業種】${safeIndustry || "その他"}
【クレーム種別】${claimType || "その他"}
【深刻度】${severityLabel}
【状況の詳細】
${safSituation}

【対応方針】
${severityGuidance}

${replyStyleGuidance}

以下の3種類の対応文を生成してください。各対応文は「---」（ハイフン3つのみの行）で区切ってください。

---
## 口頭・電話対応スクリプト

CS担当者が読み上げるセリフ形式で、**必ず500〜700文字**で生成してください。500文字未満は不可。

【必須要素】
- 冒頭：受け止めの言葉（感謝よりも先に「おわび」を。例：「このたびはご不便・ご不快をおかけし、誠に申し訳ございません。担当の[氏名]と申します」）
- 状況の確認と傾聴姿勢（例：「おっしゃる通りでございます」「ご状況を詳しくお聞かせいただけますでしょうか」「○点について確認させてください」）
- 謝罪すべき点（自社の落ち度）と謝罪しない点（事実無根・要求過剰）を明確に区別。例：「配送の遅延につきましては弊社に起因するものであり、深くお詫び申し上げます。ただし、ご請求いただいた損害賠償金については…」
- 具体的な次のアクション（例：「本日15時までに物流部門に確認し、明日午前中までにご連絡いたします」等の期日・部署名を明示）
- 深刻度「重度」の場合：上長・専門部署へのエスカレーション案内（例：「上席のカスタマーサービスマネージャーへ引き継ぎ、本日中に折り返しご連絡いたします」）
- カスタマーハラスメント（暴言・脅迫）の場合：「お申し出の内容については真摯に受け止めますが、威圧的な言動がある場合には対応を一時中断させていただく場合がございます」等の毅然とした文言

【文体】敬語・丁寧語を徹底。箇条書き禁止（流れるセリフ形式）。読み上げやすい文節で区切る。

---
## 書面・通知文

企業名義の正式文書として、**必ず500〜700文字**で生成してください。500文字未満は不可。

【必須要素】
- 文書冒頭に日付・宛名・差出人のプレースホルダー（例：令和　　年　　月　　日 / ○○様 / ○○株式会社 代表取締役 ○○　/ 件名：○○に関するご申告へのご回答について）
- 第1段落（誠意ある受け止め）：「拝啓　時下ますますご清祥のこととお慶び申し上げます。このたびは弊社[商品名/サービス名]についてご申告をいただき、誠にありがとうございます。貴重なご意見として真摯に受け止めております。」等の具体的書き出し
- 第2段落（調査結果の報告）：「弊社にて[具体的調査内容]を実施いたしました結果、[判明した事実を客観的に記述]であることが確認されました。」等の客観的記述
- 第3段落（対応策・再発防止）：曖昧な「検討します」は禁止。「○月○日までに[具体的措置]を実施いたします。また、再発防止策として[具体策]を導入いたします。」等の期日・具体策を明記
- 深刻度「重度」の場合：「今後同様の事態が継続する場合、誠に遺憾ながら法的手続きを含む必要な措置を検討せざるを得ない旨、申し添えます」等の警告文言
- 末尾：「ご不明な点がございましたら、下記担当者までご連絡ください。」＋担当者名・部署・電話番号・メールアドレスのプレースホルダー

【文体】公用文体（「ます・です」調）。段落は一行空けで区切る。「拝啓・敬具」等の頭語・結語を使用。

---
## インシデント記録テンプレート

社内保管・法的対応・監査に耐えうる客観的記述で生成してください。感情・主観は排除し事実のみを記録する形式で出力してください。**全フィールドに今回の状況に即した具体的な記載例を補記すること。**

【必須フィールド（全項目を状況に合わせて埋めること）】
- 記録番号：INC-YYYYMMDD-（連番）　※例：INC-20260316-001
- 記録日時：　　※例：2026年3月16日 14:30
- 対応者氏名・部署・役職：　　※例：山田太郎 / カスタマーサービス部 / 主任
- クレーム受付日時：　　受付方法（電話 / メール / 来店 / SNS等）：
- 申告者情報（氏名・連絡先・会員番号等。不明の場合は「取得不可」と記載）：
- 業種・事業区分：${safeIndustry || "その他"}
- クレーム種別：${claimType || "その他"}　　深刻度（低 / 中 / 高）：${severityLabel}
- クレーム内容（事実のみ・5W1Hで記述）：　　※Who（申告者）/ What（申告内容）/ When（発生日時）/ Where（発生場所）/ Why（推定原因）/ How（状況の経緯）の順に記述
- 申告者の具体的要求事項：　　※例：①代替品の即日発送 ②返金 ③再発防止の文書回答
- 対応経緯（時系列で箇条書き。日時・対応者・内容）：
  - ○月○日 ○時：受電。申告内容を傾聴・記録。謝意を伝え、○日までに回答する旨を約束
  - ○月○日 ○時：関係部署（[部署名]）へエスカレーション。調査依頼
  - ○月○日 ○時：調査結果を受領。申告者へ電話にて結果と対応策を説明・合意
- 今回の対応結果・合意内容：
- 今後の対応方針・担当者・期限：
- 証拠・資料の保管場所・ファイル名：　　※例：\\社内サーバー\CS\案件記録\INC-20260316-001\
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
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: systemPrompt,
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
          const status = (err as { status?: number })?.status;
          const msg = getClaudeErrorMessage(status ?? 500);
          controller.enqueue(encoder.encode(`\nERROR:${JSON.stringify({ error: msg })}`));
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
    return createErrorResponse(err);
  }
}
