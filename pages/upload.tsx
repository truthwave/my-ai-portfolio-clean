// /pages/upload.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedUrl(null);
    setUploadedPath(null);
    setMessage(null);
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg('ファイルを選択してください。');
      return;
    }

    setUploading(true);
    setMessage(null);
    setErrorMsg(null);

    const filePath = `${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from('results')
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      setErrorMsg(error.message);
    } else if (data) {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/results/${filePath}`;
      setUploadedUrl(url);
      setUploadedPath(filePath);
      setMessage('アップロード成功');
    }

    setUploading(false);
  };

  const handleDelete = async () => {
    if (!uploadedPath) {
      setErrorMsg('削除対象のファイルが見つかりません。');
      return;
    }

    setDeleting(true);
    setMessage(null);
    setErrorMsg(null);

    const { error } = await supabase.storage
      .from('results')
      .remove([uploadedPath]);

    if (error) {
      console.error('Delete error:', error);
      setErrorMsg(error.message);
    } else {
      setMessage('削除成功');
      setUploadedUrl(null);
      setUploadedPath(null);
    }

    setDeleting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">画像アップロード・削除</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}
      {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>

        {uploadedUrl && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? '削除中...' : '削除'}
          </button>
        )}
      </div>

      {uploadedUrl && (
        <div className="mt-4">
          <img src={uploadedUrl} alt="Uploaded" className="max-w-xs border" />
          <p className="text-sm mt-2 break-all">{uploadedUrl}</p>
        </div>
      )}
    </div>
  );
}
