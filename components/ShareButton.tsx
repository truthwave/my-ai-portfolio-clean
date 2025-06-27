// /components/ShareButton.tsx
import { useState } from 'react';

interface ShareButtonProps {
  promptId: string;
}

export default function ShareButton({ promptId }: ShareButtonProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLink = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/shared-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_id: promptId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || '共有リンク生成に失敗しました');
      }

      const data = await response.json();
      setSlug(data.slug);

      // 自動でURLをクリップボードにコピー
      const fullUrl = `${window.location.origin}/share/${data.slug}`;
      await navigator.clipboard.writeText(fullUrl);
      alert(`共有URLをコピーしました: ${fullUrl}`);
    } catch (err: any) {
      console.error('Error generating shared link:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGenerateLink}
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? '生成中...' : '共有URL生成'}
      </button>

      {slug && (
        <p className="mt-2 text-sm text-green-600">
          URL: <a href={`/share/${slug}`} target="_blank" rel="noopener noreferrer" className="underline">
            {window.location.origin}/share/{slug}
          </a>
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
