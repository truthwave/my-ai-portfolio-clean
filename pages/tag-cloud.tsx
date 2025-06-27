// /pages/tag-cloud.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface TagCount {
  id: string;
  name: string;
  count: number;
}

interface PromptResult {
  id: string;
  prompt_text: string;
}

export default function TagCloudPage() {
  const [tags, setTags] = useState<TagCount[]>([]);
  const [selectedTag, setSelectedTag] = useState<TagCount | null>(null);
  const [promptResults, setPromptResults] = useState<PromptResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchTagCounts();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      fetchPromptsByTag(selectedTag.id);
    } else {
      setPromptResults([]);
    }
  }, [selectedTag]);

  const fetchTagCounts = async () => {
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase
      .from('prompt_tags')
      .select('tag_id, tags(name), count:tag_id')
      .eq('tags.id', 'prompt_tags.tag_id')
      .group('tag_id, tags.name');

    if (error) {
      console.error('Tag count error:', error);
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Supabaseのクエリでうまく集計できない場合、JS側で集計することも可能
    const aggMap = new Map<string, TagCount>();
    for (const row of data || []) {
      const id = row.tag_id;
      const name = row.tags?.name || '';
      if (aggMap.has(id)) {
        aggMap.get(id)!.count += 1;
      } else {
        aggMap.set(id, { id, name, count: 1 });
      }
    }

    setTags(Array.from(aggMap.values()));
    setLoading(false);
  };

  const fetchPromptsByTag = async (tagId: string) => {
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase
      .from('prompt_tags')
      .select('prompts(id, prompt_text)')
      .eq('tag_id', tagId);

    if (error) {
      console.error('Prompt fetch error:', error);
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const prompts = data
      .map((item: any) => item.prompts)
      .filter((p: any) => p !== null);

    setPromptResults(prompts);
    setLoading(false);
  };

  const getFontSize = (count: number) => {
    const minSize = 12;
    const maxSize = 32;
    const maxCount = Math.max(...tags.map((t) => t.count), 1);
    return `${minSize + ((count / maxCount) * (maxSize - minSize))}px`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">タグクラウド</h1>

      {loading && <p className="text-gray-600">読み込み中...</p>}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setSelectedTag(tag)}
            style={{ fontSize: getFontSize(tag.count) }}
            className={`px-2 py-1 rounded ${
              selectedTag?.id === tag.id ? 'bg-blue-200' : 'bg-gray-100'
            } hover:bg-blue-100`}
          >
            {tag.name} ({tag.count})
          </button>
        ))}
      </div>

      {selectedTag && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            選択タグ: {selectedTag.name}
          </h2>
          {promptResults.length > 0 ? (
            <ul className="list-disc pl-6">
              {promptResults.map((pr) => (
                <li key={pr.id} className="text-sm text-gray-700">
                  {pr.prompt_text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">該当するプロンプトがありません。</p>
          )}
        </div>
      )}
    </div>
  );
}
