# 🎨 AI Prompt Portfolio App

AI支援のためのプロンプト（指示文）とその生成結果（画像・テキスト）を一括で管理できる、SaaS風ポートフォリオアプリです。  
**Next.js App Router + Supabase + Tailwind CSS** を用いてフルスタック構築しました。

## 🔥 デモ（※デプロイしている場合）

👉 [アプリを見る](https://your-vercel-url.vercel.app)

---

## 📦 主な技術スタック

| 技術       | 内容                                     |
|------------|------------------------------------------|
| Next.js    | App Router (14+), SSR/CSR 混在対応       |
| TypeScript | 厳密な型定義で安全性・保守性を強化       |
| Supabase   | Auth / Database / Storage / RLS すべて活用 |
| Tailwind CSS | スマホ対応 / クリーンなUI設計        |
| Vercel     | 無料デプロイ環境（CI/CD自動化）

---

## ✅ 主な機能一覧

| 機能カテゴリ       | 内容                                                                 |
|--------------------|----------------------------------------------------------------------|
| 🔐 認証機能         | サインアップ / ログイン / ログアウト / パスリセット対応（Supabase Auth）     |
| 📋 プロンプト管理    | 作成 / 編集 / 削除 / 詳細表示 / タグ付け（Supabase Database + App Router）|
| 🏷 タグ機能         | タグ作成 / 削除 / 一覧表示 / フィルター検索付きタグクラウド                    |
| 🖼 結果管理         | プロンプトごとの結果保存（画像 or テキスト） / Storage連携 / 画像削除対応     |
| 🔗 共有URL生成      | 公開ページ用署名付きURL生成 / サービスロールキー読込 / 非公開Storage対応      |
| 👤 ユーザー分離      | Supabase RLS（Row Level Security）で**自分のデータだけを閲覧・操作可能**         |
| 🧪 開発者向け        | 型安全 / コメント整理済 / ディレクトリ構造を意識した拡張性の高い設計

---

## 🗂️ ディレクトリ構成
my-ai-portfolio-app/
├── app/
│ ├── login/ # ログインページ
│ ├── signup/ # サインアップ
│ ├── dashboard/ # ダッシュボード（タグフィルタ・検索対応）
│ ├── prompt/[id]/ # 詳細ページ + 結果表示
│ └── share/[id]/ # 公開用URLページ（読み取り専用）
├── components/ # UI・保護レイアウト・ナビゲーションバー
├── lib/ # Supabaseクライアント・共通処理
├── styles/ # TailwindグローバルCSS
├── .env.local # Supabase URL / anon キー
└── README.md

---

## 🚀 セットアップ手順

### 1. 必要環境
- Node.js 18+
- npm または yarn
- Supabase アカウント（[https://supabase.com](https://supabase.com)）

### 2. `.env.local` を作成

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxxxxxxxx

