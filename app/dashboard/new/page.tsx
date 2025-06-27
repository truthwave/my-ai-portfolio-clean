"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProtectedLayout from "@/components/ProtectedLayout";

export default function NewPromptPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("タイトルと内容は必須です");
      return;
    }

    const userResult = await supabase.auth.getUser();
    const user = userResult.data.user;
    if (!user) {
      setError("ユーザー情報の取得に失敗しました");
      return;
    }

    const { error: insertError } = await supabase.from("prompts").insert({
      user_id: user.id,
      title,
      content,
    });

    if (insertError) {
      console.error(insertError.message);
      setError("プロンプトの登録に失敗しました");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <ProtectedLayout>
      <div className="max-w-xl mx-auto mt-8 p-4 border rounded">
        <h1 className="text-2xl font-bold mb-4">新規プロンプト登録</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              登録
            </button>
          </div>
        </form>
      </div>
    </ProtectedLayout>
  );
}
