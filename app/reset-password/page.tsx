"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) {
      console.error("パスリセットエラー:", error.message);
      setMessage(`エラー: ${error.message}`);
    } else {
      setMessage("パスワードリセットメールを送信しました。");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleReset} className="flex flex-col gap-4 w-80">
        <h1 className="text-xl font-bold">パスワードリセット</h1>
        <input
          type="email"
          placeholder="登録メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          リセットメール送信
        </button>
        {message && <p className="text-sm">{message}</p>}
      </form>
    </div>
  );
}
