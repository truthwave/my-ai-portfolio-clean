"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ProtectedLayout from "@/components/ProtectedLayout";

export default function EditPromptPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // プロンプトとタグを読み込み
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const promptRes = await supabase
          .from("prompts")
          .select("title, content")
          .eq("id", id)
          .single();

        if (promptRes.error || !promptRes.data) {
          setError("プロンプトの取得に失敗しました");
          return;
        }

        setTitle(promptRes.data.title);
        setContent(promptRes.data.content);

        const tagRes = await supabase
          .from("prompt_tags")
          .select("tag_id, tags (id, name)")
          .eq("prompt_id", id);

        if (!tagRes.error && tagRes.data) {
          const tagList = tagRes.data.map((t: any) => t.tags);
          setTags(tagList);
        }
      } catch (err) {
        console.error("取得エラー:", err);
        setError("データ取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // プロンプト更新処理
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("タイトルと内容は必須です");
      return;
    }

    const { error: updateError } = await supabase
      .from("prompts")
      .update({ title, content })
      .eq("id", id);

    if (updateError) {
      setError("更新に失敗しました");
    } else {
      router.push("/dashboard");
    }
  };

  // タグ追加処理
  const handleAddTag = async () => {
    const name = newTag.trim();
    if (!name) return;

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    // 既存タグがあるかチェック
    const { data: existingTags } = await supabase
      .from("tags")
      .select("*")
      .eq("name", name)
      .eq("user_id", user.id)
      .maybeSingle();

    let tagId = existingTags?.id;

    if (!tagId) {
      const { data: newTagData, error: insertError } = await supabase
        .from("tags")
        .insert({ name, user_id: user.id })
        .select()
        .single();

      if (insertError || !newTagData) {
        setError("タグの作成に失敗しました");
        return;
      }

      tagId = newTagData.id;
    }

    await supabase.from("prompt_tags").insert({
      prompt_id: id,
      tag_id: tagId,
    });

    setTags([...tags, { id: tagId, name }]);
    setNewTag("");
  };

  // タグ削除処理
  const handleDeleteTag = async (tagId: string) => {
    await supabase
      .from("prompt_tags")
      .delete()
      .eq("prompt_id", id)
      .eq("tag_id", tagId);

    setTags(tags.filter((t) => t.id !== tagId));
  };

  return (
    <ProtectedLayout>
      <div className="max-w-xl mx-auto mt-8 p-4 border rounded">
        <h1 className="text-2xl font-bold mb-4">プロンプト編集</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block font-medium">タイトル</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium">内容</label>
              <textarea
                className="w-full border px-3 py-2 rounded min-h-[120px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* タグ編集ブロック */}
            <div>
              <label className="block font-medium mb-1">タグ</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="bg-gray-200 px-3 py-1 rounded flex items-center"
                  >
                    <span>{tag.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTag(tag.id)}
                      className="ml-2 text-red-600 hover:text-red-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-grow border px-2 py-1 rounded"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="新しいタグ名"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  追加
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                更新する
              </button>
            </div>
          </form>
        )}
      </div>
    </ProtectedLayout>
  );
}
