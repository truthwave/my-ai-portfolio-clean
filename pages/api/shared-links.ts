// /pages/api/shared-links.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';
import { nanoid } from 'nanoid';

/**
 * POST: 共有リンク作成API
 * リクエストボディ: { prompt_id: string }
 * レスポンス: { slug: string } または { error: string }
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { prompt_id } = req.body;

    if (!prompt_id) {
      return res.status(400).json({ error: 'prompt_id is required' });
    }

    // 一意なスラッグを生成
    const slug = nanoid(10);

    // DBに挿入
    const { data, error } = await supabase
      .from('shared_links')
      .insert([{ prompt_id, slug }])
      .select()
      .single();

    if (error) {
      console.error('Error inserting shared link:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ slug: data.slug });
  }

  // POST以外のメソッドを拒否
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
