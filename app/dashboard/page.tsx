'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProtectedLayout from '@/components/ProtectedLayout';
import Link from 'next/link';

interface Prompt {
  id: string;
  title: string;
  content: string;
}

interface Tag {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // タグ一覧・プロンプト取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) {
          setError('認証されていません');
          return;
        }

        const tagRes = await supabase
          .from('tags')
          .select('id, name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (tagRes.error) throw tagRes.error;
        setTags(tagRes.data || []);

        if (selectedTag) {
          const res = await supabase
            .from('prompt_tags')
            .select('prompt_id, prompts (id, title, content)')
            .eq('tag_id', selectedTag);

          if (res.error) throw res.error;

          const filtered = res.data.map((entry: any) => entry.prompts);
          setPrompts(filtered);
        } else {
          const promptRes = await supabase
            .from('prompts')
            .select('id, title, content')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (promptRes.error) throw promptRes.error;
          setPrompts(promptRes.data || []);
        }
      } catch (err: any) {
        console.error(err.message);
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTag]);

  const handleTagClick = (tagId: string) => {
    setSelectedTag((prev) => (prev === tagId ? null : tagId));
  };

  return (
    <ProtectedLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">マイプロンプト一覧</h1>

        {/* タグ一覧 */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">タグで絞り込み:</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagClick(tag.id)}
                className={`px-3 py-1 rounded border ${
                  selectedTag === tag.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* プロンプト一覧 */}
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>読み込み中...</p>
        ) : prompts.length === 0 ? (
          <p className="text-gray-500">プロンプトがありません。</p>
        ) : (
          <div className="grid gap-4">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="p-4 border rounded shadow">
                <h3 className="text-lg font-bold">{prompt.title}</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line mt-2">
                  {prompt.content}
                </p>
                <div className="mt-4 text-right">
                  <Link
                    href={`/prompts/${prompt.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    編集
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
