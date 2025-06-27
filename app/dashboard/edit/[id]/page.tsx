"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ProtectedLayout from "@/components/ProtectedLayout";

export default function EditPromptPage() {
  const params = useParams();
  const id = params?.id as string;

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPrompt = async () => {
      try {
        const { data, error } = await supabase
          .from("prompts")
          .select("title, content")
          .eq("id", id)
          .single();

        if (error || !data) {
          setError("プロンプトの取得に失敗しました");
          console.error("Supabase error:", error?.message);
          return;
        }

        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("予期しないエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

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
      console.error("更新エラー:", updateError.message);
      return;
    }

    router.push("/dashboard");
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("このプロンプトを本当に削除しますか？");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("prompts")
      .delete()
      .eq("id", id);

    if (error) {
      setError("削除に失敗しました");
      console.error("削除エラー:", error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <ProtectedLayout>
      <div className="max-w-xl mx-auto mt-8 p-4 border rounded">
        <h1 className="text-2xl font-bold mb-4">プロンプト編集</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
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
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                更新する
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                削除する
              </button>
            </div>
          </form>
        )}
      </div>
    </ProtectedLayout>
  );
}
