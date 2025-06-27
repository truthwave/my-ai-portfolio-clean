// /pages/upload-history-batch-delete.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface ResultItem {
  id: string;
  file_path: string;
  url: string;
  size: number;
  created_at: string;
}

export default function UploadHistoryBatchDeletePage() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMsg('削除対象を選択してください。');
      return;
    }

    if (!confirm(`本当に ${selectedIds.length} 件を削除しますか？`)) {
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setMessage(null);

    const filesToDelete = results
      .filter((item) => selectedIds.includes(item.id))
      .map((item) => item.file_path);

    const { error: fileError } = await supabase.storage.from('results').remove(filesToDelete);
    if (fileError) {
      console.error('Storage delete error:', fileError);
      setErrorMsg(`ファイル削除失敗: ${fileError.message}`);
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase.from('results').delete().in('id', selectedIds);
    if (dbError) {
      console.error('DB delete error:', dbError);
      setErrorMsg(`DB削除失敗: ${dbError.message}`);
      setLoading(false);
      return;
    }

    setMessage('一括削除成功');
    setSelectedIds([]);
    await fetchResults();
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
      <h1 className="text-2xl font-bold mb-4">一括削除対応アップロード履歴</h1>

      {loading && <p className="text-gray-600">読み込み中...</p>}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <button
        onClick={handleBatchDelete}
        disabled={loading || selectedIds.length === 0}
        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 mb-4 disabled:opacity-50"
      >
        選択したファイルを一括削除
      </button>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {results.map((item) => (
          <div key={item.id} className="border rounded p-2 flex flex-col items-center">
            <label className="flex items-center mb-1">
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="mr-2"
              />
              <span className="text-xs text-gray-700">選択</span>
            </label>
            <p className="text-xs text-gray-700 mb-1">サイズ: {formatSize(item.size)}</p>
            <p className="text-xs text-gray-700 mb-1">日時: {formatDate(item.created_at)}</p>
            <img src={item.url} alt="Uploaded" className="max-w-full h-auto mb-2" />
            <p className="text-xs break-all mb-2">{item.url}</p>
          </div>
        ))}
      </div>

      {!loading && results.length === 0 && (
        <p className="text-gray-500 mt-4">履歴はありません。</p>
      )}
    </div>
  );
}
