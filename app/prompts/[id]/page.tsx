'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

type Prompt = {
  id: string;
  title: string;
  content: string;
};

type Result = {
  id: string;
  image_url: string | null;
  text: string | null;
  created_at: string;
};

export default function PromptDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // プロンプト取得
        const { data: promptData, error: promptError } = await supabase
          .from('prompts')
          .select('id, title, content')
          .eq('id', id)
          .single();

        if (promptError || !promptData) {
          setError('プロンプトが見つかりませんでした');
          return;
        }

        setPrompt(promptData);

        // 結果取得
        const { data: resultData, error: resultError } = await supabase
          .from('results')
          .select('id, image_url, text, created_at')
          .eq('prompt_id', id)
          .order('created_at', { ascending: false });

        if (resultError) {
          setError('結果の取得に失敗しました');
          return;
        }

        setResults(resultData || []);
      } catch (err) {
        console.error(err);
        setError('データ取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-4">読み込み中...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{prompt?.title}</h1>
      <p className="text-gray-700 mb-6 whitespace-pre-wrap">{prompt?.content}</p>

      <h2 className="text-xl font-semibold mb-4">結果一覧</h2>
      {results.length === 0 ? (
        <p className="text-gray-500">このプロンプトに関連する結果はまだありません。</p>
      ) : (
        <div className="grid gap-6">
          {results.map((result) => (
            <div key={result.id} className="border rounded p-4 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">
                {new Date(result.created_at).toLocaleString()}
              </p>
              {result.image_url ? (
                <Image
                  src={result.image_url}
                  alt="Result Image"
                  width={400}
                  height={300}
                  className="rounded"
                />
              ) : result.text ? (
                <p className="whitespace-pre-wrap">{result.text}</p>
              ) : (
                <p className="text-gray-400">内容なし</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
