// /pages/prompt/[id].tsx
import { GetServerSideProps } from 'next';
import { supabase } from '../../lib/supabaseClient';
import { useState } from 'react';
import { Prompt, Result } from '../../types';

interface Tag {
  id: string;
  name: string;
}

interface Props {
  prompt: Prompt | null;
  results: Result[];
  tags: Tag[];
}

export default function PromptDetailPage({ prompt, results: initialResults, tags: initialTags }: Props) {
  const [results, setResults] = useState<Result[]>(initialResults);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  const [type, setType] = useState<'text' | 'image'>('text');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loadingResult, setLoadingResult] = useState(false);
  const [loadingDeleteResult, setLoadingDeleteResult] = useState<string | null>(null);
  const [loadingTag, setLoadingTag] = useState(false);
  const [loadingDeleteTag, setLoadingDeleteTag] = useState<string | null>(null);
  const [errorResult, setErrorResult] = useState<string | null>(null);
  const [errorTag, setErrorTag] = useState<string | null>(null);

  if (!prompt) {
    return (
      <div className="p-6">
        <p className="text-red-600">指定されたプロンプトが見つかりません。</p>
      </div>
    );
  }

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingResult(true);
    setErrorResult(null);

    let imageUrl = content;
    let storagePath = '';

    if (type === 'image' && file) {
      storagePath = `${prompt.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('results')
        .upload(storagePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        setErrorResult('画像アップロードに失敗しました');
        setLoadingResult(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('results')
        .getPublicUrl(storagePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('results')
      .insert([{ prompt_id: prompt.id, type, content: imageUrl }])
      .select()
      .single();

    if (error) {
      console.error('Error inserting result:', error);
      setErrorResult('登録に失敗しました');
    } else if (data) {
      setResults([...results, data]);
      setContent('');
      setFile(null);
      setType('text');
    }

    setLoadingResult(false);
  };

  const handleDeleteResult = async (result: Result) => {
    setLoadingDeleteResult(result.id);

    const { error: deleteError } = await supabase
      .from('results')
      .delete()
      .eq('id', result.id);

    if (deleteError) {
      console.error('Error deleting result:', deleteError);
      alert('結果削除に失敗しました');
      setLoadingDeleteResult(null);
      return;
    }

    if (result.type === 'image') {
      // Storage のパスを推測
      const path = result.content.split('/storage/v1/object/public/results/')[1];
      if (path) {
        const { error: storageError } = await supabase.storage
          .from('results')
          .remove([path]);

        if (storageError) {
          console.error('Error deleting storage file:', storageError);
          alert('画像ファイル削除に失敗しました');
        }
      }
    }

    setResults(results.filter((r) => r.id !== result.id));
    setLoadingDeleteResult(null);
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    setLoadingTag(true);
    setErrorTag(null);

    let { data: tagData, error: tagFetchError } = await supabase
      .from('tags')
      .select('*')
      .eq('name', newTag.trim())
      .single();

    if (tagFetchError && tagFetchError.code !== 'PGRST116') {
      console.error('Error fetching tag:', tagFetchError);
      setErrorTag('タグ検索に失敗しました');
      setLoadingTag(false);
      return;
    }

    if (!tagData) {
      const { data: insertedTag, error: tagInsertError } = await supabase
        .from('tags')
        .insert([{ name: newTag.trim() }])
        .select()
        .single();

      if (tagInsertError) {
        console.error('Error inserting tag:', tagInsertError);
        setErrorTag('タグ登録に失敗しました');
        setLoadingTag(false);
        return;
      }
      tagData = insertedTag;
    }

    const { error: linkError } = await supabase
      .from('prompt_tags')
      .insert([{ prompt_id: prompt.id, tag_id: tagData.id }]);

    if (linkError) {
      console.error('Error linking tag:', linkError);
      setErrorTag('タグ紐付けに失敗しました');
    } else {
      setTags([...tags, tagData]);
      setNewTag('');
    }

    setLoadingTag(false);
  };

  const handleDeleteTag = async (tagId: string) => {
    setLoadingDeleteTag(tagId);
    const { error } = await supabase
      .from('prompt_tags')
      .delete()
      .eq('prompt_id', prompt.id)
      .eq('tag_id', tagId);

    if (error) {
      console.error('Error deleting tag link:', error);
      alert('タグ削除に失敗しました');
    } else {
      setTags(tags.filter((tag) => tag.id !== tagId));
    }
    setLoadingDeleteTag(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">プロンプト詳細</h1>
      <p className="mb-4 text-gray-700">{prompt.content}</p>

      <h2 className="text-xl font-semibold mb-2">タグ</h2>
      <div className="flex gap-2 flex-wrap mb-4">
        {tags.length === 0 ? (
          <p className="text-gray-500">タグはまだ登録されていません。</p>
        ) : (
          tags.map((tag) => (
            <div key={tag.id} className="flex items-center bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
              <span>{tag.name}</span>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                disabled={loadingDeleteTag === tag.id}
                className="ml-1 text-red-500 hover:text-red-700"
                title="タグ削除"
              >
                {loadingDeleteTag === tag.id ? '削除中...' : '×'}
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddTag} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="border rounded p-2 flex-1"
            placeholder="新しいタグ名"
            required
          />
          <button
            type="submit"
            disabled={loadingTag}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loadingTag ? '追加中...' : 'タグ追加'}
          </button>
        </div>
        {errorTag && <p className="text-red-600 text-sm mt-1">{errorTag}</p>}
      </form>

      <h2 className="text-xl font-semibold mb-2">生成結果</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {results.length === 0 ? (
          <p className="text-gray-500">結果はまだ登録されていません。</p>
        ) : (
          results.map((result) => (
            <div key={result.id} className="border rounded p-2 relative">
              {result.type === 'image' ? (
                <img src={result.content} alt="Result image" className="max-w-full" />
              ) : (
                <p>{result.content}</p>
              )}
              <button
                onClick={() => handleDeleteResult(result)}
                disabled={loadingDeleteResult === result.id}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-1 hover:bg-red-600"
              >
                {loadingDeleteResult === result.id ? '削除中' : '削除'}
              </button>
            </div>
          ))
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">新しい結果を登録</h2>
      <form onSubmit={handleAddResult} className="border p-4 rounded">
        <div className="mb-2">
          <label className="block mb-1 font-medium">タイプ</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'text' | 'image')}
            className="border rounded w-full p-2"
          >
            <option value="text">テキスト</option>
            <option value="image">画像ファイル</option>
          </select>
        </div>

        {type === 'text' ? (
          <div className="mb-2">
            <label className="block mb-1 font-medium">内容</label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border rounded w-full p-2"
              placeholder="テキストを入力"
              required
            />
          </div>
        ) : (
          <div className="mb-2">
            <label className="block mb-1 font-medium">画像ファイル</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border rounded w-full p-2"
              required
            />
          </div>
        )}

        {errorResult && <p className="text-red-600 text-sm mb-2">{errorResult}</p>}

        <button
          type="submit"
          disabled={loadingResult}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loadingResult ? '登録中...' : '登録する'}
        </button>
      </form>
    </div>
  );
}

// getServerSideProps は変更ありません（省略せず記載済み部分と同様）
