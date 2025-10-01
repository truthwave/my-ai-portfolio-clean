<p align="center">
<img width="1536" height="1024" alt="段落テキスト" src="https://github.com/user-attachments/assets/e7c25410-8485-4745-ac6a-0d787ac0aaf6" />
</p>
<img width="1280" height="800" alt="バフェットアフター" src="https://github.com/user-attachments/assets/21a53da5-ded1-49e0-97e2-bc804936104a" />

# 🧠 プロンプトポートフォリオ

> あなたのAIプロンプトを、整理・保存・共有する。
> SupabaseとNext.jsで構築した、シンプルで拡張性あるポートフォリオアプリ。

---

## プロジェクト概要
#### [スライド資料はこちら](https://github.com/truthwave/my-ai-portfolio-clean/tree/main/%E8%B3%87%E6%96%99/AI%20%E3%83%97%E3%83%AD%E3%83%B3%E3%83%97%E3%83%88%20%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%89)

---

## 💡 このアプリでできること

* ChatGPTや画像生成などのプロンプトを一元管理
* 出力（画像やテキスト）を紐づけて保存
* タグで絞り込み、公開URLで簡単に共有

> 複雑なUIやDB設計なしで、**実務レベルのプロンプト管理**が可能に。

---

## 🚀 主な機能

### 🔐 認証

* ユーザー登録 / ログイン / ログアウト
* パスワードリセット
* Supabase Auth + RLS によるユーザーごとのデータ分離

### 📋 プロンプト管理

* 作成・編集・削除
* 詳細ページ表示
* ダッシュボードで一覧表示

### 🏷 タグ管理

* タグ作成・削除
* プロンプトへの複数タグ付け（多対多）
* タグによる絞り込み / クラウド表示

### 🖼 結果管理

* 出力テキスト保存
* 画像アップロード（Supabase Storage）
* 結果ページの表示・削除

### 🔎 UI 機能

* タグ / キーワードによるフィルタリング検索

### 🔗 共有

* プロンプト・結果の公開URL生成
* Supabaseの署名付きURLにも対応

---

## ⚙️ 技術スタックと設計

### ✅ Supabase ベースの堅牢構成

* Auth / DB / Storage / RLS をフル活用
* サービスロールキーと署名付きURLで柔軟な公開設定

### ✅ Next.js App Router 対応

* app ディレクトリ構成 + 動的ルーティング
* Protected Layout による認証済みページ保護

### ✅ リレーション設計

* 多対多: prompts ↔ tags（中間テーブル）
* 1\:N: prompt → results
* Supabase クエリで JOIN 相当の実装

### ✅ UI/UX へのこだわり

* Tailwind CSS による美しいUI
* モバイル対応のレスポンシブデザイン
* 実務視点で考えた操作性（フィルタ・分類）

### ✅ 無料枠で運用可能

* Vercel + Supabase 無料枠でOK
* 個人開発でも安心して始められる構成

---

## 🧪 セットアップ

### 前提

* Node.js, npm がインストールされていること

### 手順

1. Supabase プロジェクト作成
2. `.env.local` に以下を設定：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. 依存パッケージをインストール：

```bash
npm install
```

4. 開発サーバーを起動：

```bash
npm run dev
```

---

## 🖼 ダッシュボード UI

![ダッシュボード画面](https://github.com/user-attachments/assets/2b357ac1-cdfb-4b78-945b-6c51bd2acbe3)

タグによる分類と、出力画像のプレビューが一画面で完結。

---

## 🧑‍💻 作者

[True Wave― 真理の波](https://github.com/truthwave)
AIツールやポートフォリオ開発に関する情報も発信中。

## お気軽にご連絡ください
[📩 ご相談・お見積もりはこちら](mailto:realmadrid71214591@gmail.com)

---

> デザインとは、どれだけ削ぎ落とせるかの勝負だ。

"Prompt Portfolio" を、プロンプト管理の新しいスタンダードに。
