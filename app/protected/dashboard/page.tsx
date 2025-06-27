"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProtectedLayout from "@/components/ProtectedLayout";

type Prompt = {
  id: string;
  content: string;
  created_at: string;
};

export default function DashboardPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ データ取得エラー:", error.message);
        setErrorMsg("データの取得に失敗しました。");
      } else {
        setPrompts(data || []);
      }

      setLoading(false);
    };

    fetchPrompts();
  }, []);

  return (
    <ProtectedLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
        {loading && <p>読み込み中...</p>}
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        {!loading && !errorMsg && (
          <ul className="space-y-2">
            {prompts.length > 0 ? (
              prompts.map((prompt) => (
                <li key={prompt.id} className="p-2 border rounded">
                  <div className="text-sm text-gray-500">
                    {new Date(prompt.created_at).toLocaleString()}
                  </div>
                  <div>{prompt.content}</div>
                </li>
              ))
            ) : (
              <p>プロンプトがありません。</p>
            )}
          </ul>
        )}
      </div>
    </ProtectedLayout>
  );
}
