// /pages/share/[slug].tsx
import { GetServerSideProps } from 'next';
import { supabaseServer } from '../../lib/supabaseServerClient';
import { Prompt, Result } from '../../types';

interface Props {
  prompt: Prompt | null;
  signedResults: { id: string; type: string; signedUrl: string | null }[];
}

export default function SharePage({ prompt, signedResults }: Props) {
  if (!prompt) {
    return <div className="p-6 text-red-600">共有データが見つかりません。</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">共有ページ</h1>
      <p className="mb-4">{prompt.content}</p>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {signedResults.length === 0 ? (
          <p className="text-gray-500">結果はありません。</p>
        ) : (
          signedResults.map((result) => (
            <div key={result.id} className="border rounded p-2">
              {result.type === 'image' && result.signedUrl ? (
                <img src={result.signedUrl} alt="Result image" className="max-w-full" />
              ) : (
                <p>（テキスト結果は非対応）</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug as string;

  // 共有リンクからプロンプトID取得
  const { data: linkData } = await supabaseServer
    .from('shared_links')
    .select('prompt_id')
    .eq('slug', slug)
    .single();

  if (!linkData) {
    return { props: { prompt: null, signedResults: [] } };
  }

  // プロンプト取得
  const { data: prompt } = await supabaseServer
    .from('prompts')
    .select('*')
    .eq('id', linkData.prompt_id)
    .single();

  if (!prompt) {
    return { props: { prompt: null, signedResults: [] } };
  }

  // 結果取得
  const { data: results } = await supabaseServer
    .from('results')
    .select('*')
    .eq('prompt_id', linkData.prompt_id);

  if (!results || results.length === 0) {
    return { props: { prompt, signedResults: [] } };
  }

  // 署名付きURL生成（画像のみ）
  const signedResults = await Promise.all(
    results.map(async (result) => {
      if (result.type === 'image') {
        // Storage パスを推測
        const path = result.content.split('/storage/v1/object/public/results/')[1];
        if (!path) return { id: result.id, type: result.type, signedUrl: null };

        const { data: urlData, error } = await supabaseServer.storage
          .from('results')
          .createSignedUrl(path, 3600); // 有効期限: 1時間

        if (error) {
          console.error(`署名付きURL生成失敗 (id=${result.id}):`, error);
          return { id: result.id, type: result.type, signedUrl: null };
        }

        return { id: result.id, type: result.type, signedUrl: urlData.signedUrl };
      } else {
        return { id: result.id, type: result.type, signedUrl: null };
      }
    })
  );

  return {
    props: {
      prompt,
      signedResults,
    },
  };
};
