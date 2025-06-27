// /pages/upload-history-export.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface ResultItem {
  id: string;
  file_path: string;
  url: string;
  size: number;
  created_at: string;
}

export default function UploadHistoryExportPage() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    setErrorMsg(null);

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

  const exportCSV = () => {
    if (results.length === 0) {
      alert('エクスポートするデータがありません。');
      return;
    }

    const header = ['ID', 'ファイルパス', 'URL', 'サイズ', '日時'];
    const rows = results.map((item) => [
      item.id,
      item.file_path,
      item.url,
      formatSize(item.size),
      formatDate(item.created_at),
    ]);

    const csvContent =
      [header, ...rows]
        .map((e) => e.map((field) => `"${field.replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upload_history_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">履歴エクスポート（CSV対応）</h1>

      {loading && <p className="text-gray-600">読み込み中...</p>}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      <button
        onClick={exportCSV}
        disabled={loading || results.length === 0}
        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 disabled:opacity-50 mb-4"
      >
        CSVエクスポート
      </button>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {results.map((item) => (
          <div key={item.id} className="border rounded p-2 flex flex-col items-center">
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
