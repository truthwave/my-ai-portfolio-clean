// /pages/compare.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Result } from '../types';
import CompareGrid from '../components/CompareGrid';

export default function ComparePage() {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.error('Error fetching results:', error);
      else setResults(data);
    };
    fetchResults();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">結果比較</h1>
      <CompareGrid results={results} />
    </div>
  );
}
