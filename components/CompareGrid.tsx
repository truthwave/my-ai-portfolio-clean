// /components/CompareGrid.tsx
import { Result } from '../types';

interface Props {
  results: Result[];
}

export default function CompareGrid({ results }: Props) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {results.map((result) => (
        <div key={result.id} className="border p-2">
          {result.type === 'image' ? (
            <img src={result.content} alt="Result image" className="max-w-full" />
          ) : (
            <p>{result.content}</p>
          )}
        </div>
      ))}
    </div>
  );
}
