// /lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// 環境変数は Vercel の設定画面で管理
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase クライアント生成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
