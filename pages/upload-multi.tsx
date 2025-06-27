// /pages/upload-multi.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface UploadedFile {
  id: string;
  file_path: string;
  url: string;
}

export default function UploadMultiPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setErrorMsg('ユーザー情報取得に失敗しました。ログインしていますか？');
      } else {
        setUserId(data.user.id);
      }
    };
    fetchUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    setErrorMsg(null);
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setErrorMsg('アップロードするファイルを選択してください。');
      return;
    }
    if (!userId) {
      setErrorMsg('ログインユーザーが確認できません。');
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    setMessage(null);

    const uploaded: UploadedFile[] = [];

    for (const file of files) {
      const filePath = `${Date.now()}_${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('results')
        .upload(filePath, file);

      if (storageError) {
        console.error('Upload error:', storageError);
        setErrorMsg(`ファイル ${file.name} のアップロード失敗: ${storageError.message}`);
        continue;
      }

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/results/${filePath}`;

      const { error: dbError } = await supabase.from('results').insert({
        user_id: userId,
        file_path: filePath,
        url: url,
      });

      if (dbError) {
        console.error('DB insert error:', dbError);
        setErrorMsg(`ファイル ${file.name} の履歴保存失敗: ${dbError.message}`);
        continue;
      }

      uploaded.push({ id: storageData?.Key || filePath, file_path: filePath, url });
    }

    setUploadedFiles([...uploadedFiles, ...uploaded]);
    setUploading(false);
    setFiles([]);
    if (uploaded.length > 0) {
      setMessage('アップロードと履歴保存が完了しました。');
    }
  };

  const handleDelete = async (file_path: string) => {
    const { error: fileError } = await supabase.storage.from('results').remove([file_path]);
    if (fileError) {
      console.error('File delete error:', fileError);
      setErrorMsg(`ファイル削除失敗: ${fileError.message}`);
      return;
    }

    const { error: dbError } = await supabase.from('results').delete().eq('file_path', file_path);
    if (dbError) {
      console.error('DB delete error:', dbError);
      setErrorMsg(`DB削除失敗: ${dbError.message}`);
      return;
    }

    setMessage('削除成功');
    setUploadedFiles(uploadedFiles.filter((f) => f.file_path !== file_path));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">複数画像アップロード・履歴保存・削除</h1>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />

      {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}
      {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {uploading ? 'アップロード中...' : '一括アップロード'}
      </button>

      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {uploadedFiles.map((file) => (
          <div key={file.file_path} className="border rounded p-2 flex flex-col items-center">
            <img src={file.url} alt="Uploaded" className="max-w-full h-auto mb-2" />
            <p className="text-xs break-all mb-2">{file.url}</p>
            <button
              onClick={() => handleDelete(file.file_path)}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
