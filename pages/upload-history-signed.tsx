// /pages/upload-history-signed.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface ResultItem {
  id: string;
  file_path: string;
  size: number;
  created_at: string;
}

interface SignedItem extends ResultItem {
  signedUrl: string | null;
}

export default function UploadHistorySignedPage() {
  const [allResults, setAllResults] = useState<ResultItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<ResultItem[]>([]);
  const [signedResults, setSignedResults] = useState<SignedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [expiryMinutes, setExpiryMinutes] = useState<number>(60);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    setErrorMsg(null);
    setMessage(null);

    const { data, error } = await supabase
      .from('results')
      .select('id, file_path, size, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setAllResults(data);
      setFilteredResults(data);
    }

    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = allResults;

    if (searchText.trim()) {
      filtered = filtered.filter((item) =>
        item.file_path.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((item) => new Date(item.created_at) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      filtered = filtered.filter((item) => new Date(item.created_at) <= toDate);
    }

    setFilteredResults(filtered);
    setSignedResults([]);
    setMessage(`フィルタ適用：${filtered.length} 件ヒット`);
  };

  const generateSignedUrls = async () => {
    setLoading(true);
    setErrorMsg(null);
    setMessage(null);

    const signedItems: SignedItem[] = await Promise.all(
      filteredResults.map(async (item) => {
        const { data: signedData, error: signedError } = await supabase.storage
          .from('results')
          .createSignedUrl(item.file_path, expiryMinutes * 60);

        if (signedError) {
          console.error('Signed URL error:', signedError);
          return { ...item, signedUrl: null };
        }

        return { ...item, signedUrl: signedData?.signedUrl || null };
      })
    );

    setSignedResults(signedItems);
    setLoading(false);
    setMessage(`署名付きURLを生成しました（有効期限: ${expiryMinutes}分）`);
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
    setAllResults(allResults.filter((r) => r.id !== id));
    setFilteredResults(filteredResults.filter((r) => r.id !== id));
    setSignedResults(signedResults.filter((r) => r.id !== id));
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
      <h1 className="text-2xl font-bold mb-4">署名付きURL付き履歴ページ</h1>

      {loading && <p className="text-gray-600">読み込み中...</p>}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="ファイル名で検索"
          className="border rounded p-1"
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border rounded p-1"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border rounded p-1"
        />
        <button
          onClick={applyFilters}
          className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600"
        >
          フィルタ適用
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium">有効期限（分）:</label>
        <input
          type="number"
          value={expiryMinutes}
          min={1}
          onChange={(e) => setExpiryMinutes(Number(e.target.value))}
          className="border rounded p-1 w-20"
        />
        <button
          onClick={generateSignedUrls}
          disabled={loading || filteredResults.length === 0}
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          署名付きURLを生成
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {signedResults.map((item) => (
          <div key={item.id} className="border rounded p-2 flex flex-col items-center">
            <p className="text-xs text-gray-700 mb-1">サイズ: {formatSize(item.size)}</p>
            <p className="text-xs text-gray-700 mb-1">日時: {formatDate(item.created_at)}</p>
            {item.signedUrl ? (
              <>
                <img src={item.signedUrl} alt="Uploaded" className="max-w-full h-auto mb-2" />
                <p className="text-xs break-all mb-2">{item.signedUrl}</p>
              </>
            ) : (
              <p className="text-red-500 text-sm mb-2">署名付きURL生成失敗</p>
            )}
            <button
              onClick={() => handleDelete(item.id, item.file_path)}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
            >
              削除
            </button>
          </div>
        ))}
      </div>

      {!loading && signedResults.length === 0 && filteredResults.length > 0 && (
        <p className="text-gray-500 mt-4">まずは「署名付きURLを生成」を押してください。</p>
      )}

      {!loading && filteredResults.length === 0 && (
        <p className="text-gray-500 mt-4">該当する履歴はありません。</p>
      )}
    </div>
  );
}
