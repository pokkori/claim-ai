"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", employees: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setStatus("sent");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4"><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">お問い合わせを受け付けました</h1>
          <p className="text-gray-500 mb-6">1〜2営業日以内にご連絡いたします。<br />お急ぎの場合はご連絡ください。</p>
          <Link href="/" className="text-blue-600 text-sm hover:underline">トップページへ戻る</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 px-6 py-4 bg-white">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/business" className="font-bold text-gray-900 text-sm">AIクレーム対応文 <span className="text-blue-600">法人向け</span></Link>
          <Link href="/tool" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">無料で試す</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-blue-600 text-sm font-medium mb-2">法人向けお問い合わせ</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">見積もり・導入相談</h1>
          <p className="text-gray-500">フォームを送信後、1〜2営業日以内にご連絡いたします。</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-8 flex gap-3">
          <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 2a6 6 0 0 1 4.75 9.75l-.75 1.5V15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1.75l-.75-1.5A6 6 0 0 1 10 2zm-1 15h2v1H9v-1z"/></svg>
          <p className="text-sm text-blue-700">ビジネスプラン（¥9,800/月）は14日間の返金保証付き。まずは無料3回お試しいただくことも可能です。</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">会社名 <span className="text-red-400">*</span></label>
              <input
                required
                type="text"
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                placeholder="株式会社○○"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">担当者名 <span className="text-red-400">*</span></label>
              <input
                required
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="山田 太郎"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">メールアドレス <span className="text-red-400">*</span></label>
            <input
              required
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="yamada@company.co.jp"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">電話番号（任意）</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="03-0000-0000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">従業員規模</label>
              <select
                value={form.employees}
                onChange={e => setForm(f => ({ ...f, employees: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="">選択してください</option>
                <option>1〜5名</option>
                <option>6〜20名</option>
                <option>21〜100名</option>
                <option>101〜500名</option>
                <option>501名以上</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ご相談内容 <span className="text-red-400">*</span></label>
            <textarea
              required
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="例：飲食チェーン10店舗で導入を検討しています。スタッフ20名程度での利用を想定しており、料金体系と請求書払いの可否を教えてください。"
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">送信に失敗しました。お手数ですが時間をおいて再度お試しください。</p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {status === "sending" ? "送信中..." : "お問い合わせを送信する →"}
          </button>

          <p className="text-xs text-gray-400 text-center">送信後1〜2営業日以内にメールでご連絡いたします</p>
        </form>
      </div>

      <footer className="border-t py-6 text-center text-xs text-gray-400 space-x-4">
        <Link href="/legal" className="hover:underline">特定商取引法に基づく表記</Link>
        <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
      </footer>
    </main>
  );
}
