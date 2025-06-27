"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    if (error) {
      console.error("更新エラー:", error.message);
      setMsg(`エラー: ${error.message}`);
    } else {
      setMsg("パスワードが更新されました。ログインページへ移動します...");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleUpdate} className="flex flex-col gap-4 w-80">
        <h1 className="text-xl font-bold">新しいパスワードを設定</h1>
        <input
          type="password"
          placeholder="新しいパスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          更新する
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}
