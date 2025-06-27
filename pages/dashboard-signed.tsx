// /pages/dashboard-signed.tsx
import { GetServerSideProps } from 'next';
import { supabaseServer } from '../lib/supabaseServerClient';
import { Prompt, Result } from '../types';

interface SignedResult {
  id: string;
  type: string;
  signedUrl: string | null;
}

interface SignedPrompt {
  id: string;
  content: string;
  signedResults: SignedResult[];
}

interface Props {
  prompts: SignedPrompt[];
}

export default function DashboardSignedPage({ prompts }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">署名付きURLダッシュボード</h1>

      {prompts.length === 0 ? (
        <p className="text-gray-500">データがありません。</p>
      ) : (
        prompts.map((prompt) => (
          <div key={prompt.id} className="border rounded mb-6 p-4">
            <h2 className="font-semibold mb-2">{prompt.content}</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {prompt.signedResults.length === 0 ? (
                <p className="text-gray-400">結果がありません。</p>
              ) : (
                prompt.signedResults.map((res) => (
                  <div key={res.id} className="border rounded p-2">
                    {res.type === 'image' && res.signedUrl ? (
                      <img src={res.signedUrl} alt="Result image" className="max-w-full" />
                    ) : (
                      <p>（テキストまたは画像なし）</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // 認証チェック
  const { data: userData, error: userError } = await supabaseServer.auth.getUser(req);

  if (userError || !userData.user) {
    // 未認証の場合はログインページへリダイレクト
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const userId = userData.user.id;

  const { data: prompts } = await supabaseServer
    .from('prompts')
    .select('*')
    .eq('user_id', userId);

  if (!prompts || prompts.length === 0) {
    return { props: { prompts: [] } };
  }

  const signedPrompts: SignedPrompt[] = [];

  for (const prompt of prompts) {
    const { data: results } = await supabaseServer
      .from('results')
      .select('*')
      .eq('prompt_id', prompt.id);

    const signedResults: SignedResult[] = await Promise.all(
      (results || []).map(async (res) => {
        if (res.type === 'image') {
          const path = res.content.split('/storage/v1/object/public/results/')[1];
          if (!path) {
            return { id: res.id, type: res.type, signedUrl: null };
          }

          const { data: urlData, error } = await supabaseServer.storage
            .from('results')
            .createSignedUrl(path, 3600);

          if (error) {
            console.error(`署名URL生成失敗 (id=${res.id}):`, error);
            return { id: res.id, type: res.type, signedUrl: null };
          }

          return { id: res.id, type: res.type, signedUrl: urlData.signedUrl };
        } else {
          return { id: res.id, type: res.type, signedUrl: null };
        }
      })
    );

    signedPrompts.push({
      id: prompt.id,
      content: prompt.content,
      signedResults,
    });
  }

  return {
    props: {
      prompts: signedPrompts,
    },
  };
};
