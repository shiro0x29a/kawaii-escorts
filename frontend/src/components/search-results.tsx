'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/use-search';
import { SearchBox } from '@/components/search-box';

interface SearchResultsProps {
  initialCity?: string;
}

export function SearchResults({ initialCity }: SearchResultsProps) {
  const t = useTranslations('Search');
  const router = useRouter();
  const [city, setCity] = useState(initialCity || '');
  const { data, isLoading } = useSearch(city ? { city } : undefined);

  useEffect(() => {
    if (initialCity) {
      setCity(initialCity);
    }
  }, [initialCity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      router.push(`/search?city=${encodeURIComponent(city.trim())}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
        <SearchBox placeholder={t('placeholder')} />
      </form>

      {isLoading && (
        <div className="text-center text-gray-500">{t('loading')}</div>
      )}

      {!isLoading && data?.data?.length === 0 && (
        <div className="text-center text-gray-500 py-12">{t('noResults')}</div>
      )}

      {!isLoading && data?.data && data.data.length > 0 && (
        <div>
          <p className="text-gray-600 mb-4">
            {data.data.length} {t('results')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((profile: any) => (
              <Link
                key={profile.id}
                href={`/profiles/${profile.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {profile.name}, {profile.age}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">{profile.city.nameEn}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
