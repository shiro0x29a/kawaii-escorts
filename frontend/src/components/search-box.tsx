'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
}

export function SearchBox({ placeholder = 'Search...', className = '' }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?city=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-6 py-3 rounded-l-full border-2 border-pink-300 focus:border-pink-500 focus:outline-none transition"
      />
      <button
        type="submit"
        className="bg-pink-600 text-white px-8 py-3 rounded-r-full hover:bg-pink-700 transition font-medium"
      >
        Search
      </button>
    </form>
  );
}
