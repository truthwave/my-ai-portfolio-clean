// /lib/supabaseServerClient.ts
import { createClient } from '@supabase/supabase-js';

// 環境変数からサービスロールキーを取得（Vercel にも登録）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// サービスロールキーでクライアント作成（サーバーサイドのみで利用）
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);
