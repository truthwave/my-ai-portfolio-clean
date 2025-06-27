// /pages/upload-history.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface ResultItem {
  id: string;
  file_path: string;
  url: string;
  size: number;
  created_at: string;
}

export default function UploadHistoryPage() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    setErrorMsg(null);
    setMessage(null);

    const { data, error } = await supabase
      .from('results')
      .select('id, file_path, url, size, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setResults(data);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string, file_path: string) => {
    setErrorMsg(null);
    setMessage(null);

    const { error: fileError } = await supabase.storage.from('results').remove([file_path]);
    if (fileError) {
      console.error('File delete error:', fileError);
      setErrorMsg(`ファイル削除失敗: ${fileError.message}`);
      return;
    }

    const { error: dbError } = await supabase.from('results').delete().eq('id', id);
    if (dbError) {
      console.error('DB delete error:', dbError);
      setErrorMsg(`DB削除失敗: ${dbError.message}`);
      return;
    }

    setMessage('削除成功');
    setResults(results.filter((r) => r.id !== id));
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">アップロード履歴</h1>

      {loading && <p className="text-gray-600">読み込み中...</p>}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {results.map((item) => (
          <div key={item.id} className="border rounded p-2 flex flex-col items-center">
            <p className="text-xs text-gray-700 mb-1">サイズ: {formatSize(item.size)}</p>
            <p className="text-xs text-gray-700 mb-1">日時: {formatDate(item.created_at)}</p>
            <img src={item.url} alt="Uploaded" className="max-w-full h-auto mb-2" />
            <p className="text-xs break-all mb-2">{item.url}</p>
            <button
              onClick={() => handleDelete(item.id, item.file_path)}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
            >
              削除
            </button>
          </div>
        ))}
      </div>

      {!loading && results.length === 0 && (
        <p className="text-gray-500 mt-4">履歴はありません。</p>
      )}
    </div>
  );
}
