-- 1️⃣ RLS を有効化
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_links ENABLE ROW LEVEL SECURITY;

-- 2️⃣ prompts テーブル: ログインユーザーのみ操作可能
CREATE POLICY "Allow authenticated access to own prompts"
ON prompts
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3️⃣ results テーブル: 自分のプロンプトに紐づくもののみ操作可能
CREATE POLICY "Allow access to results of own prompts"
ON results
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM prompts
    WHERE prompts.id = results.prompt_id
    AND prompts.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM prompts
    WHERE prompts.id = results.prompt_id
    AND prompts.user_id = auth.uid()
  )
);

-- 4️⃣ prompt_tags テーブル: 自分のプロンプトのもののみ操作可能
CREATE POLICY "Allow access to prompt_tags of own prompts"
ON prompt_tags
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM prompts
    WHERE prompts.id = prompt_tags.prompt_id
    AND prompts.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM prompts
    WHERE prompts.id = prompt_tags.prompt_id
    AND prompts.user_id = auth.uid()
  )
);

-- 5️⃣ tags テーブル: 読み取りは全員許可、書き込みはログイン者のみ
CREATE POLICY "Allow read access to all tags"
ON tags
FOR SELECT
USING (true);

CREATE POLICY "Allow insert for authenticated users"
ON tags
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 6️⃣ shared_links テーブル: 自分のプロンプトのリンクのみ操作可能
CREATE POLICY "Allow access to own shared_links"
ON shared_links
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM prompts
    WHERE prompts.id = shared_links.prompt_id
    AND prompts.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM prompts
    WHERE prompts.id = shared_links.prompt_id
    AND prompts.user_id = auth.uid()
  )
);
-- ✅ テーブル作成
create table if not exists results (
  id uuid primary key default gen_random_uuid(),       -- 主キー
  user_id uuid not null references auth.users(id) on delete cascade,  -- 認証ユーザー
  file_path text not null,                             -- Storage 上のパス
  url text not null,                                   -- 公開URLまたは署名付きURL
  size bigint not null,                                -- ファイルサイズ（バイト）
  created_at timestamp with time zone default timezone('utc', now())  -- アップロード日時
);

-- ✅ RLS 有効化
alter table results enable row level security;

-- ✅ 自分のデータのみ全操作許可
create policy "Allow authenticated users to access own results"
on results
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
