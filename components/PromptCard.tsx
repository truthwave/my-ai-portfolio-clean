// /components/PromptCard.tsx
import Link from 'next/link';
import ShareButton from './ShareButton';

interface PromptCardProps {
  prompt: {
    id: string;
    content: string;
    created_at: string;
  };
}

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <div className="border rounded p-4 shadow-sm hover:shadow-md transition">
      {/* 日付表示 */}
      <p className="text-sm text-gray-600">
        {new Date(prompt.created_at).toLocaleString()}
      </p>

      {/* プロンプト内容 */}
      <p className="font-medium mt-2 mb-4">{prompt.content}</p>

      {/* 詳細リンク */}
      <Link
        href={`/prompt/${prompt.id}`}
        className="text-blue-500 text-sm underline"
      >
        詳細を見る
      </Link>

      {/* 共有URL生成ボタン */}
      <div className="mt-2">
        <ShareButton promptId={prompt.id} />
      </div>
    </div>
  );
}
