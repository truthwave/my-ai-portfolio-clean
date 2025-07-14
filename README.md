# AI Prompt Management App

This is a web application for managing and sharing AI prompts, built with [Next.js](https://nextjs.org) and [Supabase](https://supabase.com). It helps users organize, store, and share their custom prompts and results with ease.

---

## 🚀 Features

### 🔐 Authentication

- User sign-up and login
- Password reset
- Logout
- Row Level Security (RLS) to isolate user data (Supabase Auth)

---

### 📋 Prompt Management

- Create, edit, and delete prompts
- Detailed prompt pages
- Dashboard with prompt list

---

### 🏷 Tag Management

- Create and delete tags
- Assign multiple tags to prompts (many-to-many via join table)
- Filter prompts by tags
- Tag cloud display

---

### 🖼 Result Management

- Save text results
- Upload images (using Supabase Storage)
- Delete results
- View detailed result pages

---

### 🔎 UI Features

- Filter search by tags on the dashboard
- Prompt keyword search (optional feature)

---

### 🔗 Sharing

- Generate public URLs to share prompt results
- Supports Supabase signed URLs for private storage environments

---

### ⚙️ Other

- Dynamic routing using Next.js App Router
- Protected layouts for authenticated pages
- Responsive UI with Tailwind CSS

---

## 💡 Highlights

### ✅ 1. Robust Supabase Integration

- Uses Supabase Auth, Database (PostgreSQL), Storage, and RLS
- Ensures secure, user-specific data separation via RLS
- Flexible sharing through service role keys and signed URLs

---

### ✅ 2. Next.js App Router

- Developed with Next.js app directory structure
- Implements dynamic routes like `/prompt/[id]`
- Separates client and server components effectively
- Handles authentication using Protected Layouts

---

### ✅ 3. Database Design

- Many-to-many relationship between prompts and tags via a join table
- One-to-many relationship from prompts to results
- Efficient Supabase queries to handle JOIN-like operations

---

### ✅ 4. UI/UX Focus

- Beautiful and modern UI with Tailwind CSS
- Mobile-responsive design
- Practical dashboards and tag filtering for better usability

---

### ✅ 5. Cost-Efficient Hosting

- Runs entirely on Vercel’s free tier
- Works seamlessly with Supabase’s free plan

---

## 🎯 Perfect For

- SaaS application development
- Multi-user admin dashboards
- Data management apps
- Apps with file uploads and cloud storage
- Web apps requiring secure authentication and authorization

---

## 🔧 Tech Stack

- Next.js
- Supabase
- Tailwind CSS
- TypeScript

---

## 🖼 Screenshots

*(Add screenshots here to show the UI)*

---

## ▶️ Getting Started

To run the app locally:

```bash
npm install
npm run dev
```
Then visit http://localhost:3000.

# AIプロンプト管理アプリ

このアプリは、[Next.js](https://nextjs.org) と [Supabase](https://supabase.com) を使って構築した、AIプロンプトの管理・共有用Webアプリです。  
ユーザーが自分のプロンプトやその結果を整理・保存・共有しやすくすることを目的としています。

---

## 🚀 機能一覧

### 🔐 認証機能

- ユーザー登録・ログイン
- パスワードリセット
- ログアウト
- Supabase Auth を利用した RLS（Row Level Security）によるユーザーデータ分離

---

### 📋 プロンプト管理

- プロンプトの作成・編集・削除
- プロンプト詳細ページの表示
- ダッシュボードでのプロンプト一覧表示

---

### 🏷 タグ管理

- タグの作成・削除
- プロンプトへの複数タグ付け（中間テーブルによる多対多対応）
- タグによるプロンプトの絞り込み
- タグクラウド表示

---

### 🖼 結果管理

- テキスト結果の保存
- 画像アップロード（Supabase Storage使用）
- 結果の削除
- 結果詳細ページの表示

---

### 🔎 UI機能

- ダッシュボードでのタグ絞り込み検索
- プロンプトキーワード検索（オプション）

---

### 🔗 共有機能

- プロンプト結果を共有するための公開URL生成
- Supabase の署名付きURL対応（ストレージ非公開運用時にも対応可能）

---

### ⚙️ その他

- Next.js App Router を用いた動的ルーティング
- Protected Layout による認証済みページ保護
- Tailwind CSS によるレスポンシブ対応

---

## 💡 こだわりポイント

### ✅ 1. Supabase を活かした本格構成

- Supabase の Auth、Database（PostgreSQL）、Storage、RLS を一貫して活用
- RLS によりユーザー単位でデータ分離
- サービスロールキーや署名付きURLを活用した柔軟な共有機能

---

### ✅ 2. Next.js App Router の活用

- app ディレクトリ構成で開発
- 動的ルーティング（例：/prompt/[id]）
- クライアントコンポーネントとサーバーコンポーネントの適切な使い分け
- Protected Layout による認証制御

---

### ✅ 3. リレーション設計

- プロンプトとタグの多対多を中間テーブル（prompt_tags）で実装
- プロンプト → 結果 の 1:N 関連を実装
- Supabase クエリで JOIN 相当の処理を実装

---

### ✅ 4. UI/UX へのこだわり

- Tailwind CSS を使った美しい UI
- スマホ対応（レスポンシブ）
- タグフィルタリングなど実務に通じる使いやすい UI

---

### ✅ 5. 無料枠で運用可能

- Vercel の無料枠で運用可能
- Supabase の無料枠とも組み合わせて低コスト運用を実現

---

## 🎯 活かせる分野

- SaaS アプリ開発
- マルチユーザー対応の管理画面
- データ管理系アプリ
- 画像アップロード / ストレージ活用系アプリ
- 認証・認可が必要な Web アプリ

---

## 🔧 使用技術

- Next.js
- Supabase
- Tailwind CSS
- TypeScript

---

## 🖼 スクリーンショット

*(ここに UI の画像を貼ると効果的です)*

---

## ▶️ セットアップ方法

ローカル環境で動かす場合は以下のコマンドを実行してください：

```bash
npm install
npm run dev
