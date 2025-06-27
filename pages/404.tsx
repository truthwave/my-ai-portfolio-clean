// /pages/404.tsx
import Link from 'next/link';

export default function Custom404() {
  const handleInquiry = () => {
    // メールリンク、または問い合わせフォームページにリダイレクト
    window.location.href = 'mailto:support@example.com?subject=【お問い合わせ】404ページから';
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center p-6">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">お探しのページは見つかりませんでした。</p>
      <div className="flex gap-4">
        <Link href="/">
          <a className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            トップページに戻る
          </a>
        </Link>
        <button
          onClick={handleInquiry}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          お問い合わせ
        </button>
      </div>
    </div>
  );
}
