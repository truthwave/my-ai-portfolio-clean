// これは ProtectedLayout コンポーネント（たぶん src/components/ProtectedLayout.tsx）
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">認証確認中...</p>
      </div>
    );
  }

  return <>{children}</>;
}
