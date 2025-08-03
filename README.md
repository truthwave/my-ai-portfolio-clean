<p>
<img width="1536" height="1024" alt="段落テキスト (3)" src="https://github.com/user-attachments/assets/d16a4aea-4395-4808-b6f2-097b4321ce0a" />
</p>

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
## ダッシュボードのスクリーンショット
<img width="943" height="1013" alt="ダッシュボード画面" src="https://github.com/user-attachments/assets/2b357ac1-cdfb-4b78-945b-6c51bd2acbe3" />

---

## ▶️ セットアップ方法

ローカル環境で動かす場合は以下のコマンドを実行してください：

```bash
npm install
npm run dev
```

## 🧑‍💻 作者

[ともプログラム便り](https://github.com/TomoProgrammingDayori)

ポートフォリオやAIツール開発に関する情報もぜひご覧ください！
