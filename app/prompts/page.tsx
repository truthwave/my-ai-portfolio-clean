export default function PromptsPage() {
  const prompts = [
    { id: "1", content: "プロンプト1" },
    { id: "2", content: "プロンプト2" },
  ];

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">プロンプト一覧</h1>
      <p className="mt-2">登録済みのプロンプトを表示します。</p>

      <ul className="mt-6 space-y-4">
        {prompts.map((prompt) => (
          <li key={prompt.id} className="border p-4 rounded shadow">
            <div>{prompt.content}</div>
            <a
              href={`/prompts/${prompt.id}/edit`}
              className="text-sm text-blue-600 hover:underline mr-2"
            >
              編集
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
