// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("ユーザー情報取得エラー:", error);
        return;
      }
      setUser(data.user);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("ログアウトエラー:", error);
      alert("ログアウトに失敗しました");
    } else {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white px-4 py-2">
      <div className="font-bold text-lg">
        <Link href="/">My App</Link>
      </div>

      <ul className="flex gap-4 items-center">
        <li>
          <Link href="/" className="hover:underline">
            ホーム
          </Link>
        </li>

        {user ? (
          <>
            <li>
              <Link href="/dashboard" className="hover:underline">
                ダッシュボード
              </Link>
            </li>
            <li>
              <Link href="/prompts" className="hover:underline">
                プロンプト管理
              </Link>
            </li>
            <li className="text-sm">{user.email}</li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
              >
                ログアウト
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login" className="hover:underline">
                ログイン
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:underline">
                サインアップ
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
