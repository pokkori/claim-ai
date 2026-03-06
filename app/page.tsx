import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIクレーム対応文ジェネレーター｜30秒でプロ品質の対応文を作成",
  description: "クレーム内容を入力するだけ。AIが誠実で丁寧なクレーム対応文を即時生成。飲食・小売・サービス業向け。無料で試せます。",
};

export default function ClaimLP() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-gray-900">AIクレーム対応文</span>
          <Link href="/tool" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">無料で試す</Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-red-50 text-red-600 text-xs font-medium px-3 py-1 rounded-full mb-6">飲食・小売・サービス業向け</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          クレーム対応文を<br /><span className="text-blue-600">30秒</span>で自動作成
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">クレーム内容を入力するだけ。AIが誠実で丁寧な対応文を即時生成。クレーム対応のストレスをゼロに。</p>
        <Link href="/tool" className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100">無料で3回試す →</Link>
        <p className="text-xs text-gray-400 mt-3">クレジットカード不要</p>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">こんな悩みを解決します</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {["クレーム対応文を考えるのに1時間かかる", "感情的になって返信を後悔する", "どこまで謝ればいいかわからない", "スタッフによって対応品質がバラバラ"].map(p => (
              <div key={p} className="flex gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <span className="text-red-500">😫</span>
                <p className="text-sm text-gray-700">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">料金プラン</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { name: "お試し", price: "無料", limit: "3回まで", url: "/tool", highlight: false },
              { name: "スタンダード", price: "¥4,980/月", limit: "月100件", url: "https://gumroad.com/l/REPLACE", highlight: true },
              { name: "ビジネス", price: "¥9,800/月", limit: "無制限", url: "https://gumroad.com/l/REPLACE", highlight: false },
            ].map(plan => (
              <div key={plan.name} className={`rounded-2xl border p-6 relative ${plan.highlight ? "border-blue-500 shadow-lg" : "border-gray-200"}`}>
                {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-blue-600 text-white px-3 py-0.5 rounded-full">人気</div>}
                <div className="font-bold mb-1">{plan.name}</div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{plan.price}</div>
                <div className="text-xs text-gray-500 mb-4">{plan.limit}</div>
                <Link href={plan.url} className={`block w-full text-center text-sm font-medium py-2.5 rounded-lg ${plan.highlight ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {plan.name === "お試し" ? "無料で試す" : "申し込む"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">まずは無料で試してください</h2>
        <Link href="/tool" className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50">無料で試す →</Link>
      </section>

      <footer className="border-t py-6 text-center text-xs text-gray-400">AIクレーム対応文ジェネレーター © 2026</footer>
    </main>
  );
}
