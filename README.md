# 🧠 プロンプトポートフォリオ

> あなたの“思考の軌跡”を、形に残す。
> シンプルで拡張可能。Supabase × Next.js。

<p align="center">
<img width="1536" height="1024" alt="プロンプト" src="https://github.com/user-attachments/assets/6049f93b-d61d-4a2c-bc41-3dcbe9473eeb" />
</p>


---

## なぜ作るのか

プロンプトは、使い捨てではない。
創造の履歴だ。資産だ。

このアプリは、思考を資産化するためのポートフォリオ。
複雑さを捨て、残すべきものだけを残す。

---

## 体験

- プロンプトを一元管理
- 出力（テキスト / 画像）をひも付け保存
- タグで直感的に分類
- ワンクリックで共有URLを発行
それだけ。だが、十分。

---

## 🖼 スクリーンショット
![ダッシュボード画面](https://github.com/user-attachments/assets/2b357ac1-cdfb-4b78-945b-6c51bd2acbe3)

タグによる分類と、出力画像のプレビューが一画面で完結。

---

## 使い方（3分で起動）

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

## Inside

- Stack：Next.js (App Router) / Supabase (Auth, DB, Storage, RLS) / Tailwind CSS
- モデル：prompts ↔ tags（多対多）、prompt → results（1:N）
- セキュリティ：RLS によるユーザーごとのデータ分離、署名付きURLで柔軟な公開
美しい構造は、コードの中にもある。

---

## できること（最小にして十分）
- 作成・編集・削除 / 詳細表示 / 一覧ダッシュボード
- タグ作成 / 複数タグ付与 / フィルタ検索
- 出力テキスト保存 / 画像アップロード（Supabase Storage）
- 公開URL / 署名付きURL で安全に共有

---

## ドキュメント
#### [スライド](https://github.com/truthwave/my-ai-portfolio-clean/blob/main/%E8%B3%87%E6%96%99/AI%20%E3%83%97%E3%83%AD%E3%83%B3%E3%83%97%E3%83%88%20%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%89.pdf)

---

## ライセンス

MIT License

---

## 🧑‍💻 作者

[True Wave― 真理の波](https://github.com/truthwave)
AIツールやポートフォリオ開発に関する情報も発信中。

## お気軽にご連絡ください
[📩 ご相談・お見積もりはこちら](mailto:realmadrid71214591@gmail.com)

---

> デザインとは、どれだけ削ぎ落とせるかの勝負だ。

"Prompt Portfolio" を、プロンプト管理の新しいスタンダードに。
